
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
            if (data.group_id <= 0)
            {
                _logger.LogError("Group Id Not Exist -- Group Chat Message Services");
                return false;
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

                    ResponseDTO<string> payload = parseMessage(data);

                    if (!payload.Success || payload.SingleUser is null) return false;

                    conversation = payload.SingleUser;

                    ResponseDTO<Groups_Messages> fetchUserResponse = fetchUsersMessages(data.group_id);

                    if (!fetchUserResponse.Success || fetchUserResponse.SingleUser is null) return false;

                    Groups_Messages newUm = fetchUserResponse.SingleUser;
                    newUm!.content = conversation;
                    _context.groups_messages.Add(newUm);
                    _context.SaveChanges();

                    return true;
                }

                ResponseDTO<string> payload2 = parseMessage(data);

                if (!payload2.Success || payload2.SingleUser is null) return false;

                conversation = payload2.SingleUser;


                ResponseDTO<Groups_Messages> fetchUserResponseAlt = fetchUsersMessages(data.group_id);

                if (!fetchUserResponseAlt.Success || fetchUserResponseAlt.SingleUser is null) return false;

                Groups_Messages um = fetchUserResponseAlt.SingleUser;
                um!.content = conversation;
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

                    if (!filteredChat.Any()) return 0;

                    return filteredChat.FirstOrDefault()!.id;
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
                    ResponseDTO<Groups_Messages> fetchUserResponse = fetchUsersMessages(chat_id);

                    if (!fetchUserResponse.Success || fetchUserResponse.SingleUser is null) return 0;

                    Groups_Messages um = fetchUserResponse.SingleUser;

                    if (data!.participants!.Count() <= 0) return um!.group_id;

                    if (data is null || data.participants is null) return 0;

                    foreach (var participant in data.participants)
                    {
                        if (gmCreated)
                        {
                            if (participant is not null && !string.IsNullOrEmpty(participant.id))
                            {
                                data.user_id = participant.id;
                            }
                            await addParticipantToGroup(data, um!.group_id);
                        }
                    }

                    return um!.group_id;
                }

                if (data!.participants!.Count() <= 0) return chat_id;

                if (data is null || data.participants is null) return 0;

                foreach (var participant in data!.participants)
                {
                    if (gmCreated)
                    {
                        if (participant is not null && !string.IsNullOrEmpty(participant.id))
                        {
                            data.user_id = participant.id;
                        }
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
                ResponseDTO<Groups_Messages> fetchUserResponse = fetchUsersMessages(group_id);

                if (fetchUserResponse is null ||
                    fetchUserResponse.SingleUser is null ||
                    !fetchUserResponse.Success) return false;
                Groups_Messages filteredConvo = fetchUserResponse.SingleUser;

                if (filteredConvo is null) return false;
                string chats = filteredConvo.content ?? "";

                if (string.IsNullOrEmpty(chats)) return false;
                GroupMessageSchemas parseConvo = JsonSerializer.Deserialize<GroupMessageSchemas>(chats)!;

                if (parseConvo is null || parseConvo.messages is null) return false;
                IEnumerable<GroupChatSchemas> messages = parseConvo!.messages;

                if (messages is null || !messages.Any()) return false;
                foreach (var item in messages)
                {
                    if (item is not null && item.user_id is not null)
                    {
                        if (!item.user_id.Equals(data?.sender_id))
                        {
                            item.read = true;
                        }
                    }
                }

                if (parseConvo.participants is null || data is null || string.IsNullOrEmpty(data.groupname)) return false;

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
                string payloadId = "0";
                if (!string.IsNullOrEmpty(data.user_id))
                {
                    payloadId = data.user_id;
                }

                if (payloadId == "0") return false;

                AspNetUsers participants = await _context.AspNetUsers.FindAsync(payloadId);

                if (participants is null) return false;

                bool groupExist = chatExist(group_id);

                if (!groupExist) return false;

                ResponseDTO<Groups_Messages> fetchUserResponse = fetchUsersMessages(group_id);

                if (fetchUserResponse is null || fetchUserResponse.SingleUser is null || !fetchUserResponse.Success) return false;

                Groups_Messages group = fetchUserResponse.SingleUser;

                if (group is null || string.IsNullOrEmpty(group.content)) return false;
                GroupMessageSchemas parsedMessage = JsonSerializer.Deserialize<GroupMessageSchemas>(group!.content)!;

                if (parsedMessage is null ||
                    parsedMessage.messages is null ||
                    parsedMessage.participants is null) return false;

                var messages = parsedMessage.messages.ToImmutableArray();
                var allParticipants = parsedMessage.participants.ToImmutableArray();

                var newParticipants = allParticipants.Add(new ParticipantsSchema
                {
                    id = participants.Id,
                    name = participants.UserName,
                    connectionid = participants.ConnectionId
                });

                string payload = JBProcessor.GroupChatProcessed(group_id, data.groupname, messages.ToArray(), newParticipants.ToArray());

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
        private ResponseDTO<string> parseMessage(GroupRequest data)
        {
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                IQueryable<Groups_Messages> currentChat = from c in _context.groups_messages select c;
                currentChat = currentChat.Where(c => c.id == data.group_id);
                var chat = currentChat!.FirstOrDefault()!.content;

                if (string.IsNullOrEmpty(chat)) return new ResponseDTO<string> { Success = false };

                GroupMessageSchemas parsedMessage = JsonSerializer.Deserialize<GroupMessageSchemas>(chat)!;

                if (parsedMessage is null || parsedMessage.messages is null) return new ResponseDTO<string> { Success = false };
                var messages = parsedMessage.messages.ToImmutableArray();

                string payloadId = "0";

                if (!string.IsNullOrEmpty(data.sender_id))
                {
                    payloadId = data.sender_id;
                }
                else if (!string.IsNullOrEmpty(data.user_id))
                {
                    payloadId = data.user_id;
                }

                AspNetUsers user = _context?.AspNetUsers?.Find(payloadId);

                var newMessages = messages.Add(new GroupChatSchemas
                {
                    id = Guid.NewGuid().ToString(),
                    content = data?.value,
                    user_id = data?.sender_id?.ToString(),
                    username = user != null ? user!.UserName : "Unknown",
                    created_at = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    read = false,
                    groupname = data?.groupname
                });

                if (parsedMessage.participants is null) return new ResponseDTO<string> { Success = false };
                string payload = JBProcessor.GroupChatProcessed(data!.group_id, data.groupname, newMessages.ToArray(), parsedMessage.participants);

                return new ResponseDTO<string> { Success = true, SingleUser = payload };
            }
        }

        /// <summary>
        /// Funcion que busca el User_messages relacionado con el chat
        /// </summary>
        /// <param name="chat_id"></param> -- ID del Chat
        /// <returns>Models.Groups_Messages -- El user messages que coincide con el chat en cuestion</returns>
        private ResponseDTO<Groups_Messages> fetchUsersMessages(int chat_id)
        {
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                IQueryable<Groups_Messages> filteredUserMessages = from um in _context.groups_messages select um;
                filteredUserMessages = filteredUserMessages.Where(um => um.group_id == chat_id);

                if (filteredUserMessages.Any()) return new ResponseDTO<Groups_Messages> { Success = false };

                return new ResponseDTO<Groups_Messages> { Success = true, SingleUser = filteredUserMessages.FirstOrDefault() };
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
        private async Task<bool> createMembership(int group_id, string user_id = "0")
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
