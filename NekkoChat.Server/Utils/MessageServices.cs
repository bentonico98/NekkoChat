using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.Security;
using Microsoft.VisualBasic;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;
using System.Collections.Immutable;
using System.Text.Json;

namespace NekkoChat.Server.Utils
{
    //Servicios que se encargaran del envio de los mensajes
    public class MessageServices(ApplicationDbContext _context)
    {

        /// <summary>
        /// Funcion que se encargue del envio de los mensajes
        /// </summary>
        /// <param name="chat_id"></param> -- Id del Chat 
        /// <param name="sender_id"></param> -- Id del que envia
        /// <param name="receiver_id"></param> -- Id del que recibe
        /// <param name="msj"></param> -- Mensaje enviado
        /// <returns>bool -- Indica si fue exitoso o fallido</returns>
        public async Task<bool> sendMessage(int chat_id, string sender_id, string receiver_id, string msj)
        {
            bool chatExists = chatExist(chat_id);
            string conversation = "";
            if (!chatExists)
            {
                int chatId = await createChat(sender_id, receiver_id, msj);
                if (chatId <= 0)
                {
                    return false;
                }
                chat_id = chatId;
                conversation = parseMessage(chat_id, sender_id, msj);
                Users_Messages newUm = fetchUsersMessages(chat_id);
                newUm.content = conversation;
                await _context.users_messages.AddRangeAsync(newUm);
                _context.SaveChanges();

                return true;
            }
            conversation = parseMessage(chat_id, sender_id, msj);
            Users_Messages um = fetchUsersMessages(chat_id);
            um.content = conversation;
            _context.users_messages.UpdateRange(um);
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
        public async Task<int> createChat(string sender_id, string receiver_id, string msj)
        {

            bool chatExisted = chatExist(sender_id, receiver_id);

            if (chatExisted)
            {
                IQueryable<Chats> filteredChat = from chat in _context.chats select chat;
                filteredChat = filteredChat.Where(chat => chat.sender_id == sender_id && chat.receiver_id == receiver_id);
                if(filteredChat == null)
                {
                    IQueryable<Chats> filteredChatAlt = from chat in _context.chats select chat;
                    filteredChatAlt = filteredChatAlt.Where(chat => chat.sender_id == receiver_id && chat.receiver_id == sender_id);
                    return filteredChatAlt.FirstOrDefault().id;

                }
                return filteredChat.FirstOrDefault().id;
            }

            Chats newChat = new Chats
            {
                sender_id = sender_id,
                receiver_id = receiver_id,
                type = "private",
                isArchived = false,
                isFavorite = false
            };
           
            _context.chats.Add(newChat);

            _context.SaveChanges();

            int chat_id = newChat.id;

            bool umCreated = await createUserMessage(chat_id, sender_id, receiver_id, msj);

            if (!umCreated)
            {
                Users_Messages um = fetchUsersMessages(chat_id);
                return um.chat_id;
            }

            return chat_id;
        }

        public void readMessage() { }
        public void favoriteMessage() { }
        public void archiveMessage() { }
        public void deleteMessage() { }
        public void deleteChat() { }




        /// /////////////// FUNCIONES PRIVADAS -- DEBAJO DE ESTA LINEA



        /// <summary>
        /// Funcion que convierte de JSONB a Array y de Array a JSONB para almacenar en la DB
        /// </summary>
        /// <param name="chat_id"></param> -- ID del Chat
        /// <param name="sender_id"></param> -- ID del que envia el mensaje
        /// <param name="msj"></param> -- Mensaje enviado por el usuario
        /// <returns>string -- El objeto JSON convertido en STRING</returns>
        private string parseMessage(int chat_id, string sender_id, string msj)
        {
            IQueryable<Users_Messages> currentChat = from c in _context.users_messages select c;
            currentChat = currentChat.Where(c => c.chat_id == chat_id);
            var chat = currentChat!.FirstOrDefault()!.content;

            MessageSchemas parsedMessage = JsonSerializer.Deserialize<MessageSchemas>(chat);
            var messages = parsedMessage.messages.ToImmutableArray();

            AspNetUsers user = _context.AspNetUsers.Find(sender_id);

            var newMessages = messages.AddRange(new SingleChatSchemas
            {
                id = Guid.NewGuid().ToString(),
                content = msj,
                user_id = sender_id.ToString(),
                username = user!.UserName,
                created_at = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                read = false
            });

            string payload = "{" + $"\"_id\":\"{chat_id}\",\"messages\":{JsonSerializer.Serialize(newMessages)}, \"participants\":{JsonSerializer.Serialize(parsedMessage.participants)}" + "}";
            
            return payload;
        }

        /// <summary>
        /// Funcion que busca el User_messages relacionado con el chat
        /// </summary>
        /// <param name="chat_id"></param> -- ID del Chat
        /// <returns>Models.Users_Messages -- El user messages que coincide con el chat en cuestion</returns>
        private Models.Users_Messages fetchUsersMessages(int chat_id)
        {
            IQueryable<Users_Messages> filteredUserMessages = from um in _context.users_messages select um;
            filteredUserMessages = filteredUserMessages.Where(um => um.chat_id == chat_id);
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

            var chatExist = _context.chats.Any(c => c.id == chat_id);

            if (!chatExist)
            {
                return false;
            }

            return chatExist;
        }

        /// <summary>
        /// Funccion que verifica si chat existe filtrando por el sender_id y receiver_id
        /// </summary>
        /// <param name="sender_id"></param> -- ID del que envia el mensaje
        /// <param name="receiver_id"></param> -- ID del otro participante del chat, el que recibe el mensaje
        /// <returns> bool (true/false) -- en base a si el registro existe o no</returns>
        private bool chatExist(string sender_id, string receiver_id)
        {
            if ( string.IsNullOrEmpty(sender_id) || string.IsNullOrEmpty(receiver_id) )
            {
                return false;
            }

            if (_context.chats.Any(c => c.receiver_id == receiver_id) && _context.chats.Any(c => c.sender_id == sender_id))
            {
                return true;
            }
            else if (_context.chats.Any(c => c.receiver_id == sender_id) && _context.chats.Any(c => c.sender_id == receiver_id))
            {
                return true;
            }

            return false;
        }

        /// <summary>
        /// Funccion que crea el user message relacionado con el chat si no existe
        /// </summary>
        /// <param name="chat_id"></param> -- Id del Chat proveniente del URL
        /// <param name="sender_id"></param> -- Id del que envia el mensaje
        /// <param name="msj"></param> -- Mensaje del Usario
        /// <returns> bool (true/false) -- en base a si la operacion fue exitosa o no</returns>
        private async Task<bool> createUserMessage(int chat_id, string sender_id, string receiver_id, string msj)
        {
            if (string.IsNullOrEmpty(sender_id) || string.IsNullOrEmpty(receiver_id)) return false;

            AspNetUsers sender = await _context.AspNetUsers.FindAsync(sender_id);
            AspNetUsers receiver = await _context.AspNetUsers.FindAsync(receiver_id);

            if (sender == null || receiver == null || chat_id <= 0) return false;

            object[] newMessages = [new SingleChatSchemas
            {
                id = Guid.NewGuid().ToString(),
                content = msj,
                user_id = sender_id.ToString(),
                username = sender!.UserName,
                created_at = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                read = false
            }];

            object[] newParticipants = [new ParticipantsSchema 
            {   
                id = sender_id, 
                name= sender.UserName, 
                connectionid= sender.ConnectionId
            }, new ParticipantsSchema
            {
                id = receiver_id,
                name= receiver.UserName,
                connectionid= receiver.ConnectionId
            }];

            Users_Messages userMsj = new Users_Messages
            {
                chat_id = chat_id,
                content = "{" + $"\"_id\":\"{chat_id}\",\"messages\":{JsonSerializer.Serialize(newMessages)}, \"participants\":{JsonSerializer.Serialize(newParticipants)}" + "}"
            };

            await _context.users_messages.AddRangeAsync(userMsj);
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
