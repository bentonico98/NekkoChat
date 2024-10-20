using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using NekkoChat.Server.Data;
using NekkoChat.Server.Utils;
using NekkoChat.Server.Models;
using Microsoft.VisualBasic;
using System.Text.Json;
using Newtonsoft.Json;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatsController(ApplicationDbContext context) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;
        private readonly MessageServices _messageServices = new MessageServices(context);

        // GET: Chats/1 --- BUSCA TODAS LAS CONVERSACIONES DE EL USUARIO
        [HttpGet("chats")]
        public IActionResult Get(string id, string type = "all")
        {
            try
            {
                List<Chats> UserChats = new();
                List<object> ChatsContent = new();

                IQueryable<Chats> conversations = from c in _context.chats select c;

                if (type == "favorites")
                {
                    conversations = conversations.Where((c) => c.sender_id == id || c.receiver_id == id).Where((c) => c.isFavorite == true);
                }
                else if (type == "archived")
                {
                    conversations = conversations.Where((c) => c.sender_id == id || c.receiver_id == id).Where((c) => c.isArchived == true);
                }
                else
                {
                    conversations = conversations.Where((c) => c.sender_id == id || c.receiver_id == id);
                }

                foreach (var conversation in conversations)
                {
                    UserChats.Add(conversation);
                }

                foreach (var userChat in UserChats)
                {
                    IQueryable<Users_Messages> chat = from u in _context.users_messages select u;
                    chat = chat.Where((u) => u.chat_id == userChat.id);
                    foreach (var c in chat)
                    {
                        ChatsContent.Add(JsonDocument.Parse(c.content));
                    }
                }

                if (ChatsContent == null)
                {
                    return NotFound(new { Message = "No index found" });
                }

                return Ok(ChatsContent);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }

        // GET chats/chat/5 -- BUSCA UN CHAT ESPECIFICO
        [HttpGet("chat/{id}")]
        public IActionResult GetChatByUserId([FromRoute] string id)
        {

            try
            {
                List<object> currentChats = new();
                int chat_id = int.Parse(id);
                IQueryable<Users_Messages> chat = from u in _context.users_messages select u;
                chat = chat.Where((u) => u.chat_id == chat_id);

                foreach (var c in chat)
                {
                    currentChats.Add(JsonDocument.Parse(c.content));
                }
                return Ok(currentChats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }

        // POST chats/chat/create?sender_id=${sender_id}&receiver_id=${receiver_id}&value=${value} -- Ruta para creacion de un chat que tdv no exista
        [HttpPost("chat/create")]
        public async Task<IActionResult> Post(string value, string sender_id, string receiver_id)
        {
            int messageSent = await _messageServices.createChat(sender_id, receiver_id, value);
            if (messageSent <= 0)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message", success = false });
            }
            object payload = new { success = true, chatId = messageSent };
            return Ok(payload);
        }

        // PUT chats/chat/send/{id}?sender_id=${sender_id}&receiver_id=${receiver_id}&value=${value} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/send/{id}")]
        public async Task<IActionResult> Put(int id, string value, string sender_id, string receiver_id)
        {
            bool messageSent = await _messageServices.sendMessage(id, sender_id, receiver_id, value);
            if (!messageSent)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message" });
            }
            return Ok();
        }
        // PUT chats/chat/read/{id}?sender_id=${sender_id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/read/{chat_id}")]
        public IActionResult PutMessageRead(int chat_id, string sender_id)
        {
            bool messageSent = _messageServices.readMessage(chat_id, sender_id);
            if (!messageSent)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message" });
            }
            return Ok();
        }
        // PUT chats/chat/manage/{id}?operation=${operation}&favorite={true/false}&archive={true/false}&user_id={user_id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/manage/{chat_id}")]
        public IActionResult PutManageChat(int chat_id, [FromQuery] string operation, [FromQuery] bool favorite, [FromQuery] bool archive, [FromQuery] string user_id)
        {
            bool managed = false;

            if (operation == "archive")
            {
                managed = _messageServices.archiveMessage(chat_id, user_id, archive);

            }
            else if (operation == "favorite")
            {
                managed = _messageServices.favoriteMessage(chat_id, user_id, archive);
            }
            
            if (!managed)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message" });
            }
            return Ok();
        }

        // DELETE chats/chat/delete/{id}/5 -- Ruta que borra o sale de un chat (PROXIMAMENTE)
        [HttpDelete("chat/delete/{id}")]
        public void Delete(int id)
        {

        }

        // DELETE chats/chat/message/delete/5?user_id=user_id -- Ruta que borra o sale de un chat (PROXIMAMENTE)
        [HttpDelete("chat/message/delete/{id}")]
        public IActionResult DeleteSingleMessage(int id, [FromQuery] string message_id, [FromQuery] string user_id)
        {
            bool messageDeleted = _messageServices.deleteMessage(id, message_id, user_id);
            if (!messageDeleted)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message" });
            }
            return Ok();
        }
    }
}

