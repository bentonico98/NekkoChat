using Microsoft.VisualBasic;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;
using System.Collections.Immutable;
using System.Text.Json;
using NekkoChat.Server.Constants.Interfaces;
using System;
using static System.Runtime.InteropServices.JavaScript.JSType;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNet.Identity;
namespace NekkoChat.Server.Utils
{
    //Servicios que se encargaran del envio de los mensajes
    public class MessageServices([FromServices] IServiceProvider srv, [FromServices] ILogger<MessageServices> logger) : iMessageService
    {
        private readonly ILogger<MessageServices> _logger = logger;

        /// <summary>
        /// Funcion que se encargue del envio de los mensajes
        /// </summary>
        /// <param name="chat_id"></param> -- Id del Chat 
        /// <param name="sender_id"></param> -- Id del que envia
        /// <param name="receiver_id"></param> -- Id del que recibe
        /// <param name="msj"></param> -- Mensaje enviado
        /// <returns>bool -- Indica si fue exitoso o fallido</returns>
        public async Task<bool> sendMessage(int chat_id, ChatRequest data)
        {
            bool chatExists = chatExist(chat_id);
            string conversation = "";
            if (!chatExists)
            {
                int chatId = await createChat(data);
                if (chatId <= 0)
                {
                    _logger.LogError("Chat No Exist -- Message Services");
                    return false;
                }
                chat_id = chatId;
                ResponseDTO<string> parseMessageResponse = await parseMessage(chat_id, data);

                if (!parseMessageResponse.Success || parseMessageResponse.SingleUser is null) return false;
                conversation = parseMessageResponse.SingleUser;

                ResponseDTO<Users_Messages> fetchUsersMessagesResponse = fetchUsersMessages(chat_id);

                if (!fetchUsersMessagesResponse.Success || fetchUsersMessagesResponse.SingleUser is null) return false;
                Users_Messages newUm = fetchUsersMessagesResponse.SingleUser;
                newUm.content = conversation;
                using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                {
                    await _context.users_messages.AddRangeAsync(newUm);
                    _context.SaveChanges();
                }
                return true;
            }
            ResponseDTO<string> parseMessageResponseAlt = await parseMessage(chat_id, data);
            if (!parseMessageResponseAlt.Success || parseMessageResponseAlt.SingleUser is null) return false;

            conversation = parseMessageResponseAlt.SingleUser;

            ResponseDTO<Users_Messages> fetchUsersMessagesResponseAlt = fetchUsersMessages(chat_id);

            if (!fetchUsersMessagesResponseAlt.Success || fetchUsersMessagesResponseAlt.SingleUser is null) return false;
            Users_Messages um = fetchUsersMessagesResponseAlt.SingleUser;
            um.content = conversation;

            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                _context.users_messages.UpdateRange(um);
                _context.SaveChanges();
            }
            return chatExists;
        }

        /// <summary>
        /// Funccion que crea el chat si no existe
        /// </summary>
        /// <param name="sender_id"></param> - ID del que envia
        /// <param name="receiver_id"></param> -- Id del que recibe
        /// <param name="msj"></param> -- Mensaje enviado por el que envia
        /// <returns>int -- ID del Chat Creado</returns>
        public async Task<int> createChat(ChatRequest data)
        {
            if (string.IsNullOrEmpty(data.sender_id) || string.IsNullOrEmpty(data.receiver_id))
            {
                _logger.LogError("Sender Id Or Receiver Id Not Exist -- Message Services");
            }

            if (string.IsNullOrEmpty(data.sender_id) || string.IsNullOrWhiteSpace(data.receiver_id)) return 0;

            bool chatExisted = chatExist(data.sender_id, data.receiver_id);

            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (chatExisted)
                {
                    IQueryable<Chats> filteredChat = from chat in _context.chats select chat;
                    filteredChat = filteredChat.Where(chat => chat.sender_id == data.sender_id && chat.receiver_id == data.receiver_id || chat.sender_id == data.receiver_id && chat.receiver_id == data.sender_id);

                    if (!filteredChat.Any()) return 0;

                    return filteredChat.FirstOrDefault()!.id;
                }

                Chats newChat = new Chats
                {
                    sender_id = data.sender_id,
                    receiver_id = data.receiver_id,
                    type = "private",
                    isArchived = false,
                    isFavorite = false
                };

                _context.chats.Add(newChat);

                _context.SaveChanges();

                int chat_id = newChat.id;

                bool umCreated = await createUserMessage(chat_id, data);

                if (!umCreated)
                {
                    ResponseDTO<Users_Messages> fetchUsersMessagesResponse = fetchUsersMessages(chat_id);

                    if (!fetchUsersMessagesResponse.Success || fetchUsersMessagesResponse.SingleUser is null) return 0;
                    Users_Messages um = fetchUsersMessagesResponse.SingleUser;
                    return um.chat_id;
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
        public bool readMessage(int chat_id, string sender_id)
        {
            if (chat_id <= 0 || string.IsNullOrEmpty(sender_id))
            {
                _logger.LogError("Sender Id Or Chat Id Not Exist -- Message Services");
            }
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (string.IsNullOrEmpty(sender_id)) return false;

                ResponseDTO<Users_Messages> filteredConvoResponse = fetchUsersMessages(chat_id);

                if (!filteredConvoResponse.Success || filteredConvoResponse.SingleUser is null) return false;
                Users_Messages filteredConvo = filteredConvoResponse.SingleUser;
                var chats = filteredConvo.content;

                if (string.IsNullOrEmpty(chats)) return false;

                MessageSchemas parseConvo = JsonSerializer.Deserialize<MessageSchemas>(chats)!;

                if (parseConvo is null || parseConvo.messages is null || parseConvo.participants is null) return false;
                IEnumerable<SingleChatSchemas> messages = parseConvo!.messages;

                foreach (var item in messages)
                {
                    if (item is not null && !string.IsNullOrEmpty(item.user_id))
                    {
                        if (!item.user_id.Equals(sender_id))
                        {
                            item.read = true;
                        }
                    }
                }

                string payload = JBProcessor.PrivateChatProcessed(chat_id, messages.ToArray(), parseConvo.participants);

                filteredConvo.content = payload;
                _context.users_messages.UpdateRange(filteredConvo);
                _context.SaveChanges();
            }
            return true;
        }
        public bool favoriteMessage(int chat_id, ChatRequest data)
        {
            if (chat_id <= 0 || string.IsNullOrEmpty(data.user_id))
            {
                _logger.LogError("User Id Or Chat Id Not Exist -- Message Services");
            }

            if (string.IsNullOrEmpty(data.user_id) || chat_id <= 0) return false;
            bool chatExisted = chatExist(chat_id, data.user_id);

            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (!chatExisted) return false;

                Chats chat = _context.chats.Find(chat_id)!;

                chat!.isFavorite = data.favorite;

                _context.chats.Update(chat);
                _context.SaveChanges();
            }

            return true;
        }
        public bool archiveMessage(int chat_id, ChatRequest data)
        {
            if (string.IsNullOrEmpty(data.sender_id) || chat_id <= 0)
            {
                _logger.LogError("Sender Id Or Receiver Id Not Exist -- Message Services");
            }

            if (string.IsNullOrEmpty(data.user_id) || chat_id <= 0) return false;
            bool chatExisted = chatExist(chat_id, data.user_id);

            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (!chatExisted) return false;

                Chats chat = _context.chats.Find(chat_id)!;

                chat!.isArchived = data.archive;

                _context.chats.Update(chat);
                _context.SaveChanges();
            }

            return true;
        }
        public async Task<bool> deleteMessage(int chat_id, ChatRequest data)
        {
            if (chat_id <= 0)
            {
                _logger.LogError("Sender Id Or Receiver Id Not Exist -- Message Services");
            }

            if (chat_id <= 0) return false;

            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                ResponseDTO<Users_Messages> filteredConvoResponse = fetchUsersMessages(chat_id);

                if (!filteredConvoResponse.Success || filteredConvoResponse.SingleUser is null) return false;
                Users_Messages filteredConvo = filteredConvoResponse.SingleUser;

                if (filteredConvo is null || filteredConvo.content is null) return false;
                string chats = filteredConvo.content;

                if (string.IsNullOrEmpty(chats)) return false;
                MessageSchemas parseConvo = JsonSerializer.Deserialize<MessageSchemas>(chats)!;

                if (parseConvo is null || parseConvo.messages is null || parseConvo.participants is null) return false;
                IEnumerable<SingleChatSchemas> messages = parseConvo!.messages;

                bool isUserMessage = this.belongToUser(messages, data);

                if (!isUserMessage)
                {
                    return false;
                }

                List<SingleChatSchemas> newConvoAfterDeletion = new();

                foreach (var message in messages)
                {
                    if (message.id != data.message_id)
                    {
                        newConvoAfterDeletion.Add(message);
                    }
                }

                ParticipantsSchema[] participantPayload = await refreshParticipants(parseConvo.participants);

                string payload = JBProcessor.PrivateChatProcessed(chat_id, newConvoAfterDeletion.ToArray(), participantPayload);

                filteredConvo.content = payload;

                _context.users_messages.Update(filteredConvo);
                _context.SaveChanges();
            }

            return true;
        }
        public bool deleteChat(int chat_id, string user_id)
        {
            // --- TO DO
            return true;
        }



        /// /////////////// FUNCIONES PRIVADAS -- DEBAJO DE ESTA LINEA



        private bool belongToUser(IEnumerable<SingleChatSchemas> messages, ChatRequest data)
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
        private async Task<ResponseDTO<string>> parseMessage(int chat_id, ChatRequest data)
        {
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (chat_id <= 0 || string.IsNullOrEmpty(data.sender_id)) return new ResponseDTO<string> { Success = false };

                IQueryable<Users_Messages> currentChat = from c in _context.users_messages select c;
                currentChat = currentChat.Where(c => c.chat_id == chat_id);

                if (!currentChat.Any()) return new ResponseDTO<string> { Success = false };
                var chat = currentChat!.FirstOrDefault()!.content;

                if (string.IsNullOrEmpty(chat)) return new ResponseDTO<string> { Success = false };
                MessageSchemas parsedMessage = JsonSerializer.Deserialize<MessageSchemas>(chat)!;

                if (parsedMessage is null || parsedMessage.messages is null || parsedMessage.participants is null) return new ResponseDTO<string> { Success = false };

                var messages = parsedMessage.messages.ToImmutableArray();

                AspNetUsers user = _context.AspNetUsers.Find(data.sender_id)!;

                var newMessages = messages.AddRange(new SingleChatSchemas
                {
                    id = Guid.NewGuid().ToString(),
                    content = data.value,
                    user_id = data.sender_id.ToString(),
                    username = user != null ? user!.UserName : "Unknown",
                    created_at = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    read = false
                });

                ParticipantsSchema[] participantPayload = await refreshParticipants(parsedMessage.participants);

                string payload = JBProcessor.PrivateChatProcessed(chat_id, newMessages.ToArray(), participantPayload);

                return new ResponseDTO<string> { Success = true, SingleUser = payload };
            }
        }

        /// <summary>
        /// Funcion que busca el User_messages relacionado con el chat
        /// </summary>
        /// <param name="chat_id"></param> -- ID del Chat
        /// <returns>Models.Users_Messages -- El user messages que coincide con el chat en cuestion</returns>
        private ResponseDTO<Users_Messages> fetchUsersMessages(int chat_id)
        {
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                IQueryable<Users_Messages> filteredUserMessages = from um in _context.users_messages select um;
                filteredUserMessages = filteredUserMessages.Where(um => um.chat_id == chat_id);

                if (!filteredUserMessages.Any() || filteredUserMessages is null) return new ResponseDTO<Users_Messages> { Success = false };

                Users_Messages payload = filteredUserMessages.FirstOrDefault()!;
                return new ResponseDTO<Users_Messages> { Success = true, SingleUser = payload };
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
                var chatExist = _context.chats.Any(c => c.id == chat_id);

                if (!chatExist)
                {
                    return false;
                }

                return chatExist;
            }
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="chat_id"></param>
        /// <param name="user_id"></param>
        /// <returns>BOOL true / false</returns>
        private bool chatExist(int chat_id, string user_id)
        {
            if (chat_id <= 0)
            {
                return false;
            }
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                var chatExist = _context.chats.Any(c => c.id == chat_id && c.sender_id == user_id || c.receiver_id == user_id);

                if (!chatExist)
                {
                    return false;
                }

                return chatExist;
            }
        }

        /// <summary>
        /// Funccion que verifica si chat existe filtrando por el sender_id y receiver_id
        /// </summary>
        /// <param name="sender_id"></param> -- ID del que envia el mensaje
        /// <param name="receiver_id"></param> -- ID del otro participante del chat, el que recibe el mensaje
        /// <returns> bool (true/false) -- en base a si el registro existe o no</returns>
        private bool chatExist(string sender_id, string receiver_id)
        {
            if (string.IsNullOrEmpty(sender_id) || string.IsNullOrEmpty(receiver_id))
            {
                return false;
            }
            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                if (_context.chats.Any(c => c.receiver_id == receiver_id && c.sender_id == sender_id) || _context.chats.Any(c => c.receiver_id == sender_id && c.sender_id == receiver_id))
                {
                    return true;
                }
            }
            return false;
        }
        private async Task<ParticipantsSchema[]> refreshParticipants(ParticipantsSchema[] participants)
        {
            List<ParticipantsSchema> payload = new();

            foreach (var participant in participants)
            {
                if (participant is not null)
                {
                    using (var db = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                    {
                        var user = await db.AspNetUsers.FindAsync(participant.id)!;
                        if (user is not null)
                        {
                            payload.Add(new ParticipantsSchema
                            {
                                id = user.Id,
                                name = user.UserName!,
                                connectionid = user.ConnectionId!,
                                profilePic = user.ProfilePhotoUrl!
                            });
                        }
                    }
                }
            }
            return payload.ToArray();
        }


        /// <summary>
        /// Funccion que crea el user message relacionado con el chat si no existe
        /// </summary>
        /// <param name="chat_id"></param> -- Id del Chat proveniente del URL
        /// <param name="sender_id"></param> -- Id del que envia el mensaje
        /// <param name="msj"></param> -- Mensaje del Usario
        /// <returns> bool (true/false) -- en base a si la operacion fue exitosa o no</returns>
        private async Task<bool> createUserMessage(int chat_id, ChatRequest data)
        {
            if (string.IsNullOrEmpty(data.sender_id) || string.IsNullOrEmpty(data.receiver_id) || chat_id <= 0)
            {
                _logger.LogError("Sender Id Or Receiver Id Or Chat Id Not Exist -- Message Services");
                return false;
            }

            using (var _context = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                var sender = await _context.AspNetUsers.FindAsync(data.sender_id);
                var receiver = await _context.AspNetUsers.FindAsync(data.receiver_id);

                if (sender is null || receiver is null || chat_id <= 0) return false;

                SingleChatSchemas[] newMessages = [new SingleChatSchemas
                {
                    id = Guid.NewGuid().ToString(),
                    content = data.value,
                    user_id = data.sender_id.ToString(),
                    username = sender.UserName!,
                    created_at = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"),
                    read = false
                }];

                ParticipantsSchema[] newParticipants = [new ParticipantsSchema
                {
                    id = data.sender_id,
                    name= sender.UserName!,
                    connectionid= sender.ConnectionId!,
                    profilePic = !string.IsNullOrEmpty(sender.ProfilePhotoUrl) ? sender.ProfilePhotoUrl : "/src/assets/avatar.png"

                }, new ParticipantsSchema
                {
                    id = data.receiver_id,
                    name= receiver.UserName!,
                    connectionid= receiver.ConnectionId!,
                    profilePic = !string.IsNullOrEmpty(receiver.ProfilePhotoUrl) ? receiver.ProfilePhotoUrl : "/src/assets/avatar.png"

                }];

                Users_Messages userMsj = new Users_Messages
                {
                    chat_id = chat_id,
                    content = JBProcessor.PrivateChatProcessed(chat_id, newMessages, newParticipants),
                };

                await _context.users_messages.AddRangeAsync(userMsj);
                _context.SaveChanges();

                int umId = userMsj.id;

                if (umId <= 0)
                {
                    _logger.LogError("Operation Failed -- Message Services");
                    return false;
                }
                return true;
            }
        }
    }
}
