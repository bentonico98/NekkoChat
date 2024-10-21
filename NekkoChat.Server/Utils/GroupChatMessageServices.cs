
using Microsoft.VisualBasic;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;
using System.Collections.Immutable;
using System.Text.Json;
using NekkoChat.Server.Constants.Interfaces;
using System;
namespace NekkoChat.Server.Utils
{
    //Servicios que se encargaran del envio de los mensajes
    public class GroupChatMessageServices(ApplicationDbContext _context)
    {

        /// <summary>
        /// Funcion que se encargue del envio de los mensajes
        /// </summary>
        /// <param name="chat_id"></param> -- Id del Chat 
        /// <param name="sender_id"></param> -- Id del que envia
        /// <param name="receiver_id"></param> -- Id del que recibe
        /// <param name="msj"></param> -- Mensaje enviado
        /// <returns>bool -- Indica si fue exitoso o fallido</returns>
        public async Task<bool> sendMessage(int group_id, string sender_id,  string groupname, string grouptype, string groupdesc, string groupphoto, string msj)
        {
            bool chatExists = chatExist(group_id);
            string conversation = "";
            if (!chatExists)
            {
                int chatId = await createChat(sender_id, group_id, groupname, grouptype, groupdesc, groupphoto, msj);
                if (chatId <= 0)
                {
                    return false;
                }
                group_id = chatId;
                conversation = parseMessage(group_id, sender_id, groupname, msj);
                Groups_Messages newUm = fetchUsersMessages(group_id);
                newUm.content = conversation;
                await _context.groups_messages.AddRangeAsync(newUm);
                _context.SaveChanges();

                return true;
            }
            conversation = parseMessage(group_id, sender_id, groupname, msj);
            Groups_Messages um = fetchUsersMessages(group_id);
            um.content = conversation;
            _context.groups_messages.UpdateRange(um);
            _context.SaveChanges();

            return chatExists;
        }

        /// <summary>
        /// Funccion que crea el chat si no existe
        /// </summary>
        /// <param name="sender_id"></param> - ID del que envia
        /// <param name="receiver_id"></param> -- Id del que recibe
        /// <param name="msj"></param> -- Mensaje enviado por el que envia
        /// <returns>int -- ID del Chat Creado</returns>
        public async Task<int> createChat(string sender_id, int group_id, string groupname, string grouptype, string groupdesc, string groupphoto, string msj)
        {

            bool chatExisted = chatExist(group_id);

            if (chatExisted)
            {
                IQueryable<Groups_Members> filteredChat = from gm in _context.groups_members select gm;
                filteredChat = filteredChat.Where(gm => gm.user_id == sender_id && gm.group_id == group_id);
                return filteredChat.FirstOrDefault().id;
            }

            Groups newChat = new Groups
            {
                name = groupname,
                type = grouptype,
                description = groupdesc,
                profilePhotoUrl = groupphoto
            };

            _context.groups.Add(newChat);

            _context.SaveChanges();

            int chat_id = newChat.id;

            bool umCreated = await createUserMessage(chat_id, sender_id, group_id, groupname, msj);

            if (!umCreated)
            {
                Groups_Messages um = fetchUsersMessages(chat_id);
                return um.group_id;
            }

            return chat_id;
        }
        /// <summary>
        /// Funccion que se encarga de mandar el "read receipt"
        /// </summary>
        /// <param name="chat_id"></param>
        /// <param name="sender_id"></param>
        /// <returns>BOOLEAN</returns>
        public bool readMessage(int chat_id, string sender_id, string groupname)
        {
            if (string.IsNullOrEmpty(sender_id)) return false;
            Groups_Messages filteredConvo = fetchUsersMessages(chat_id);
            var chats = filteredConvo.content;
            GroupMessageSchemas parseConvo = JsonSerializer.Deserialize<GroupMessageSchemas>(chats);
            IEnumerable<GroupChatSchemas> messages = parseConvo!.messages;
            foreach (var item in messages)
            {
                if(!item.user_id.Equals(sender_id))
                {
                    item.read = true;
                }
            }
            string payload = "{" + $"\"_id\":\"{chat_id}\",\"messages\":{JsonSerializer.Serialize(messages)},\"groupname\":\"{groupname}\", \"participants\":{JsonSerializer.Serialize(parseConvo.participants)}" + "}";

            filteredConvo.content = payload;
            _context.groups_messages.UpdateRange(filteredConvo);
            _context.SaveChanges();
            return true;
        }
        public void favoriteMessage() { }
        public void archiveMessage() { }
        public void deleteMessage() { }
        public void deleteChat() { }

        public async Task<bool> addParticipantToGroup(string user_id, int group_id, string groupname)
        {
            if(string.IsNullOrEmpty(user_id)) return false;

            AspNetUsers participants = await _context.AspNetUsers.FindAsync(user_id);

            if(participants == null) return false;

            bool groupExist = chatExist(group_id);

            if (!groupExist) return false;

            Groups_Messages group = fetchUsersMessages(group_id);

            GroupMessageSchemas parsedMessage = JsonSerializer.Deserialize<GroupMessageSchemas>(group.content);

            var messages = parsedMessage.messages.ToImmutableArray();
            var allParticipants = parsedMessage.participants.ToImmutableArray();

            var newParticipants = allParticipants.AddRange(new ParticipantsSchema
            {
                id = participants.Id,
                name = participants.UserName,
                connectionid = participants.ConnectionId
            });

            string payload = "{" + $"\"_id\":\"{group_id}\",\"messages\":{JsonSerializer.Serialize(messages)},\"groupname\":\"{groupname}\", \"participants\":{JsonSerializer.Serialize(newParticipants)}" + "}";

            group.content = payload;
            _context.groups_messages.UpdateRange(group);
            _context.SaveChanges();

            Groups_Members newMember = new Groups_Members { group_id = group_id, user_id = user_id };

            _context.groups_members.AddRange(newMember);
            _context.SaveChanges();
            
            return true;
        }


        /// /////////////// FUNCIONES PRIVADAS -- DEBAJO DE ESTA LINEA



        /// <summary>
        /// Funcion que convierte de JSONB a Array y de Array a JSONB para almacenar en la DB
        /// </summary>
        /// <param name="chat_id"></param> -- ID del Chat
        /// <param name="sender_id"></param> -- ID del que envia el mensaje
        /// <param name="msj"></param> -- Mensaje enviado por el usuario
        /// <returns>string -- El objeto JSON convertido en STRING</returns>
        private string parseMessage(int chat_id, string sender_id, string groupname, string msj)
        {
            IQueryable<Groups_Messages> currentChat = from c in _context.groups_messages select c;
            currentChat = currentChat.Where(c => c.id == chat_id);
            var chat = currentChat!.FirstOrDefault()!.content;

            GroupMessageSchemas parsedMessage = JsonSerializer.Deserialize<GroupMessageSchemas>(chat);
            var messages = parsedMessage.messages.ToImmutableArray();

            AspNetUsers user = _context.AspNetUsers.Find(sender_id);

            var newMessages = messages.AddRange(new GroupChatSchemas
            {
                id = Guid.NewGuid().ToString(),
                content = msj,
                user_id = sender_id.ToString(),
                username = user!.UserName,
                created_at = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                read = false,
                groupname = groupname
            });

            string payload = "{" + $"\"_id\":\"{chat_id}\",\"messages\":{JsonSerializer.Serialize(newMessages)},\"groupname\":\"{groupname}\", \"participants\":{JsonSerializer.Serialize(parsedMessage.participants)}" + "}";

            return payload;
        }

        /// <summary>
        /// Funcion que busca el User_messages relacionado con el chat
        /// </summary>
        /// <param name="chat_id"></param> -- ID del Chat
        /// <returns>Models.Groups_Messages -- El user messages que coincide con el chat en cuestion</returns>
        private Models.Groups_Messages fetchUsersMessages(int chat_id)
        {
            IQueryable<Groups_Messages> filteredUserMessages = from um in _context.groups_messages select um;
            filteredUserMessages = filteredUserMessages.Where(um => um.group_id == chat_id);
            return filteredUserMessages.FirstOrDefault();
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

            var chatExist = _context.groups.Any(c => c.id == chat_id);

            if (!chatExist)
            {
                return false;
            }

            return chatExist;
        }


        /// <summary>
        /// Funccion que crea el user message relacionado con el chat si no existe
        /// </summary>
        /// <param name="chat_id"></param> -- Id del Chat proveniente del URL
        /// <param name="sender_id"></param> -- Id del que envia el mensaje
        /// <param name="msj"></param> -- Mensaje del Usario
        /// <returns> bool (true/false) -- en base a si la operacion fue exitosa o no</returns>
        private async Task<bool> createUserMessage(int chat_id, string sender_id, int group_id, string groupname, string msj)
        {
            if (string.IsNullOrEmpty(sender_id) || group_id <=0 ) return false;

            AspNetUsers sender = await _context.AspNetUsers.FindAsync(sender_id);

            if (sender == null  || chat_id <= 0) return false;

            object[] newMessages = [new GroupChatSchemas
            {
                id = Guid.NewGuid().ToString(),
                content = msj,
                user_id = sender_id.ToString(),
                username = sender!.UserName,
                created_at = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                read = false,
                groupname = groupname
            }];

            object[] newParticipants = [new ParticipantsSchema
            {
                id = sender_id,
                name= sender.UserName,
                connectionid= sender.ConnectionId
            }];

            Groups_Messages userMsj = new Groups_Messages
            {
                group_id = chat_id,
                content = "{" + $"\"_id\":\"{chat_id}\",\"messages\":{JsonSerializer.Serialize(newMessages)}, \"groupname\":\"{groupname}\", \"participants\":{JsonSerializer.Serialize(newParticipants)}" + "}"
            };

            await _context.groups_messages.AddRangeAsync(userMsj);
            _context.SaveChanges();

            int umId = userMsj.id;

            if (umId <= 0)
            {
                return false;
            }

            return true;
        }

    }
}
