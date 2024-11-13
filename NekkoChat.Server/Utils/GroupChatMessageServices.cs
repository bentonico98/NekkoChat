
using Microsoft.VisualBasic;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;
using System.Collections.Immutable;
using System.Text.Json;
using NekkoChat.Server.Constants.Interfaces;
using System;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
namespace NekkoChat.Server.Utils
{
    //Servicios que se encargaran del envio de los mensajes
    public class GroupChatMessageServices([FromServices] IServiceProvider srv, [FromServices] ILogger<GroupChatMessageServices> logger) : iGroupChatMessageService
    {
        private readonly ILogger<GroupChatMessageServices> _logger = logger;

        /// <summary>
        /// Funcion que se encargue del envio de los mensajes
        /// </summary>
        /// <param name="chat_id"></param> -- Id del Chat 
        /// <param name="sender_id"></param> -- Id del que envia
        /// <param name="receiver_id"></param> -- Id del que recibe
        /// <param name="msj"></param> -- Mensaje enviado
        /// <returns>bool -- Indica si fue exitoso o fallido</returns>
        public async Task<bool> sendMessage(GroupRequest data)
        {
            if (data.group_id<=0)
            {
                _logger.LogError("Group Id Not Exist -- Group Chat Message Services");
            }

            bool chatExists = chatExist(data.group_id);
            string conversation = "";
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (!chatExists)
                {
                    int chatId = await createChat(data);
                    if (chatId <= 0)
                    {
                        _logger.LogError("Group Id Not Exist -- Group Chat Message Services");
                        return false;
                    }
                    data.group_id = chatId;
                    conversation = parseMessage(data);
                    Groups_Messages newUm = fetchUsersMessages(data.group_id);
                    newUm.content = conversation;
                    _context.groups_messages.Add(newUm);
                    _context.SaveChanges();

                    return true;
                }
                conversation = parseMessage(data);
                Groups_Messages um = fetchUsersMessages(data.group_id);
                um.content = conversation;
                _context.groups_messages.Update(um);
                _context.SaveChanges();

                return chatExists;
            }
        }

        /// <summary>
        /// Funccion que crea el chat si no existe
        /// </summary>
        /// <param name="sender_id"></param> - ID del que envia
        /// <param name="receiver_id"></param> -- Id del que recibe
        /// <param name="msj"></param> -- Mensaje enviado por el que envia
        /// <returns>int -- ID del Chat Creado</returns>
        public async Task<int> createChat(GroupRequest data)
        {
            if (data.group_id <= 0 || string.IsNullOrEmpty(data.sender_id))
            {
                _logger.LogError("Group Id OR Sender Id Not Exist -- Group Chat Message Services");
            }
            bool chatExisted = chatExist(data.group_id);
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (chatExisted)
                {
                    IQueryable<Groups_Members> filteredChat = from gm in _context.groups_members select gm;
                    filteredChat = filteredChat.Where(gm => gm.user_id == data.sender_id && gm.group_id == data.group_id);
                    return filteredChat.FirstOrDefault().id;
                }

                Groups newChat = new Groups
                {
                    name = data.groupname,
                    type = data.grouptype,
                    description = data.groupdesc,
                    profilePhotoUrl = data.groupphoto
                };

                await _context.groups.AddAsync(newChat);
                await _context.SaveChangesAsync();

                int chat_id = newChat.id;

                data.user_id = data.sender_id;
                bool umCreated = await createUserMessage(chat_id, data);
                bool gmCreated = await createMembership(chat_id, data.user_id);

                if (!umCreated)
                {
                    Groups_Messages um = fetchUsersMessages(chat_id);

                    if (data!.participants!.Count() <= 0) return um.group_id;

                    foreach (var participant in data!.participants)
                    {
                        if (gmCreated)
                        {
                            data.user_id = participant.id;
                            await addParticipantToGroup(data, um.group_id);
                        }
                    }

                    return um.group_id;
                }

                if (data!.participants!.Count() <= 0) return chat_id;

                foreach (var participant in data!.participants)
                {
                    if (gmCreated)
                    {
                        data.user_id = participant.id;
                        await addParticipantToGroup(data, chat_id);
                    }
                }

                return chat_id;
            }
        }
        /// <summary>
        /// Funccion que se encarga de mandar el "read receipt"
        /// </summary>
        /// <param name="chat_id"></param>
        /// <param name="sender_id"></param>
        /// <returns>BOOLEAN</returns>
        public bool readMessage(GroupRequest data, int group_id)
        {
            if (group_id <= 0)
            {
                _logger.LogError("Group Id Not Exist -- Group Chat Message Services");
            }

            if (string.IsNullOrEmpty(data.sender_id)) return false;

            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                Groups_Messages filteredConvo = fetchUsersMessages(group_id);
                var chats = filteredConvo.content;
                GroupMessageSchemas parseConvo = JsonSerializer.Deserialize<GroupMessageSchemas>(chats);
                IEnumerable<GroupChatSchemas> messages = parseConvo!.messages;
                foreach (var item in messages)
                {
                    if (!item.user_id.Equals(data.sender_id))
                    {
                        item.read = true;
                    }
                }
                string payload = JBProcessor.GroupChatProcessed(group_id, data.groupname, messages.ToArray(), parseConvo.participants);
                //string payload = "{" + $"\"_id\":\"{group_id}\",\"messages\":{JsonSerializer.Serialize(messages)},\"groupname\":\"{data.groupname}\", \"participants\":{JsonSerializer.Serialize(parseConvo.participants)}" + "}";

                filteredConvo.content = payload;
                _context.groups_messages.UpdateRange(filteredConvo);
                _context.SaveChanges();
            }
            return true;
        }
        public bool favoriteMessage(int group_id, ChatRequest data)
        {
            if (group_id <= 0)
            {
                _logger.LogError("Group Id Not Exist -- Group Chat Message Services");
            }

            bool chatExisted = chatExist(group_id);

            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (!chatExisted) return false;

                IQueryable<User_Group_Preferences> chats = _context.user_group_preferencess.Where((pref) => pref.group_id == group_id && pref.user_id == data.user_id);

                if (chats.Count() <= 0) return false;

                foreach (var chat in chats)
                {
                    chat!.isFavorite = data.favorite;
                    _context.user_group_preferencess.Update(chat);
                }
                _context.SaveChanges();

            }
            return true;
        }
        public bool archiveMessage(int group_id, ChatRequest data)
        {
            if (group_id <= 0)
            {
                _logger.LogError("Group Id Not Exist -- Group Chat Message Services");
            }

            bool chatExisted = chatExist(group_id);

            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (!chatExisted) return false;

                IQueryable<User_Group_Preferences> chats = _context.user_group_preferencess.Where((pref) => pref.group_id == group_id && pref.user_id == data.user_id);

                if (chats.Count() <= 0) return false;

                foreach (var chat in chats)
                {
                    chat!.isArchived = data.archive;
                    _context.user_group_preferencess.Update(chat);
                }
                _context.SaveChanges();
            }
            return true;
        }
        public bool deleteMessage(int chat_id, ChatRequest data)
        {
            /*if (chat_id <= 0)
            {
                _logger.LogError("Group Id Not Exist -- Group Chat Message Services");
            }
            if (chat_id <= 0) return false;

            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                Groups_Messages filteredConvo = fetchUsersMessages(chat_id);
                var chats = filteredConvo.content;
                GroupMessageSchemas parseConvo = JsonSerializer.Deserialize<GroupMessageSchemas>(chats);
                IEnumerable<GroupChatSchemas> messages = parseConvo!.messages;

                bool isUserMessage = belongToUser(messages, data);

                if (!isUserMessage) return false;

                List<GroupChatSchemas> newConvoAfterDeletion = new();

                foreach (var message in messages)
                {
                    if (message.id != data.message_id)
                    {
                        newConvoAfterDeletion.Add(message);
                    }
                }
                string payload = JBProcessor.GroupChatProcessed(chat_id, data.groupname, newConvoAfterDeletion.ToArray(), parseConvo.participants);
                //string payload = "{" + $"\"_id\":\"{chat_id}\",\"messages\":{JsonSerializer.Serialize(newConvoAfterDeletion)}, \"participants\":{JsonSerializer.Serialize(parseConvo.participants)}" + "}";

                filteredConvo.content = payload;

                _context.groups_messages.Update(filteredConvo);
                _context.SaveChanges();
            }*/

            return true;
        }
        public bool deleteChat()
        {
            return true;
        }

        public async Task<bool> addParticipantToGroup(GroupRequest data, int group_id)
        {
            if (group_id <= 0 || string.IsNullOrEmpty(data.user_id))
            {
                _logger.LogError("Group Id Or User Id Not Exist -- Group Chat Message Services");
            }

            if (string.IsNullOrEmpty(data.user_id)) return false;

            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                AspNetUsers participants = await _context.AspNetUsers.FindAsync(data.user_id);

                if (participants == null) return false;

                bool groupExist = chatExist(group_id);

                if (!groupExist) return false;

                Groups_Messages group = fetchUsersMessages(group_id);

                GroupMessageSchemas parsedMessage = JsonSerializer.Deserialize<GroupMessageSchemas>(group.content);

                var messages = parsedMessage.messages.ToImmutableArray();
                var allParticipants = parsedMessage.participants.ToImmutableArray();

                var newParticipants = allParticipants.Add(new ParticipantsSchema
                {
                    id = participants.Id,
                    name = participants.UserName,
                    connectionid = participants.ConnectionId
                });

                string payload = JBProcessor.GroupChatProcessed(group_id, data.groupname, messages.ToArray(), newParticipants.ToArray());
                //string payload = "{" + $"\"_id\":\"{group_id}\",\"messages\":{JsonSerializer.Serialize(messages)},\"groupname\":\"{data.groupname}\", \"participants\":{JsonSerializer.Serialize(newParticipants)}" + "}";

                group.content = payload;
                _context.groups_messages.UpdateRange(group);

                Groups_Members newMember = new Groups_Members
                {
                    group_id = group_id,
                    user_id = data.user_id
                };

                await _context.groups_members.AddAsync(newMember);
                await _context.SaveChangesAsync();
            }
            return true;
        }


        /// /////////////// FUNCIONES PRIVADAS -- DEBAJO DE ESTA LINEA


        private bool belongToUser(IEnumerable<GroupChatSchemas> messages, ChatRequest data)
        {
            var exist = messages.Where((m) => m.id == data.message_id && m.user_id == data.user_id);

            if (!exist.Any()) return false;

            return true;
        }


        /// <summary>
        /// Funcion que convierte de JSONB a Array y de Array a JSONB para almacenar en la DB
        /// </summary>
        /// <param name="chat_id"></param> -- ID del Chat
        /// <param name="sender_id"></param> -- ID del que envia el mensaje
        /// <param name="msj"></param> -- Mensaje enviado por el usuario
        /// <returns>string -- El objeto JSON convertido en STRING</returns>
        private string parseMessage(GroupRequest data)
        {
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                IQueryable<Groups_Messages> currentChat = from c in _context.groups_messages select c;
                currentChat = currentChat.Where(c => c.id == data.group_id);
                var chat = currentChat!.FirstOrDefault()!.content;

                GroupMessageSchemas parsedMessage = JsonSerializer.Deserialize<GroupMessageSchemas>(chat);
                var messages = parsedMessage.messages.ToImmutableArray();

                AspNetUsers user = _context.AspNetUsers.Find(data.sender_id);

                var newMessages = messages.Add(new GroupChatSchemas
                {
                    id = Guid.NewGuid().ToString(),
                    content = data.value,
                    user_id = data.sender_id.ToString(),
                    username = user!.UserName,
                    created_at = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    read = false,
                    groupname = data.groupname
                });

                string payload = JBProcessor.GroupChatProcessed(data.group_id, data.groupname, newMessages.ToArray(), parsedMessage.participants);
                //string payload = "{" + $"\"_id\":\"{data.group_id}\",\"messages\":{JsonSerializer.Serialize(newMessages)},\"groupname\":\"{data.groupname}\", \"participants\":{JsonSerializer.Serialize(parsedMessage.participants)}" + "}";

                return payload;
            }
        }

        /// <summary>
        /// Funcion que busca el User_messages relacionado con el chat
        /// </summary>
        /// <param name="chat_id"></param> -- ID del Chat
        /// <returns>Models.Groups_Messages -- El user messages que coincide con el chat en cuestion</returns>
        private Models.Groups_Messages fetchUsersMessages(int chat_id)
        {
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                IQueryable<Groups_Messages> filteredUserMessages = from um in _context.groups_messages select um;
                filteredUserMessages = filteredUserMessages.Where(um => um.group_id == chat_id);
                return filteredUserMessages.FirstOrDefault();
            }
        }

        /// <summary>
        /// Funccion que verifica si chat existe filtrando por el chat_id
        /// </summary>
        /// <param name="chat_id"></param> -- ID del Chat
        /// <returns>bool (true/false) -- en base a si el registro existe o no</returns>
        private bool chatExist(int chat_id)
        {
            if (chat_id <= 0)
            {
                return false;
            }
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                var chatExist = _context.groups.Any(c => c.id == chat_id);

                if (!chatExist)
                {
                    return false;
                }

                return chatExist;
            }
        }


        /// <summary>
        /// Funccion que crea el user message relacionado con el chat si no existe
        /// </summary>
        /// <param name="chat_id"></param> -- Id del Chat proveniente del URL
        /// <param name="sender_id"></param> -- Id del que envia el mensaje
        /// <param name="msj"></param> -- Mensaje del Usario
        /// <returns> bool (true/false) -- en base a si la operacion fue exitosa o no</returns>
        private async Task<bool> createUserMessage(int chat_id, GroupRequest data)
        {
            if (string.IsNullOrEmpty(data.sender_id)) return false;
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                AspNetUsers sender = await _context.AspNetUsers.FindAsync(data.sender_id);

                if (sender == null || chat_id <= 0) return false;

                GroupChatSchemas[] newMessages = [new GroupChatSchemas
                {
                    id = Guid.NewGuid().ToString(),
                    content = data.value,
                    user_id = data.sender_id.ToString(),
                    username = sender!.UserName,
                    created_at = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    read = false,
                    groupname = data.groupname
                }];

                ParticipantsSchema[] newParticipants = [new ParticipantsSchema
                {
                    id = sender.Id,
                    name= sender.UserName,
                    connectionid= sender.ConnectionId
                }];

                Groups_Messages userMsj = new Groups_Messages
                {
                    group_id = chat_id,
                    content = JBProcessor.GroupChatProcessed(chat_id, data.groupname, newMessages, newParticipants)
                    //content = "{" + $"\"_id\":\"{chat_id}\",\"messages\":{JsonSerializer.Serialize(newMessages)}, \"groupname\":\"{data.groupname}\", \"participants\":{JsonSerializer.Serialize(newParticipants)}" + "}"
                };

                await _context.groups_messages.AddAsync(userMsj);
                await _context.SaveChangesAsync();

                int umId = userMsj.id;

                if (umId <= 0)
                {
                    return false;
                }

                return true;
            }
        }
        private async Task<bool> createMembership(int group_id, string user_id)
        {
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                Groups_Members newMessages = new Groups_Members
                {
                    group_id = group_id,
                    user_id = user_id
                };

                await _context.groups_members.AddAsync(newMessages);
                await _context.SaveChangesAsync();

                int umId = newMessages.id;

                if (umId <= 0)
                {
                    return false;
                }
                return true;
            }
        }
    }
}
