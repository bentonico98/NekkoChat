using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using NekkoChat.Server.Data;
using NekkoChat.Server.Utils;
using NekkoChat.Server.Models;
using Microsoft.VisualBasic;
using System.Text.Json;
using Newtonsoft.Json;
using NekkoChat.Server.Constants;
using static System.Runtime.InteropServices.JavaScript.JSType;
using NekkoChat.Server.Constants.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatsController(
        ApplicationDbContext context,
        ILogger<ChatsController> logger,
        iMessageService messageServices,
        IServiceProvider srv) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;
        private readonly ILogger<ChatsController> _logger = logger;
        private readonly iMessageService _messageServices = messageServices;
        private readonly IServiceProvider _srv = srv;

        // GET: Chats/1 --- BUSCA TODAS LAS CONVERSACIONES DE EL USUARIO
        [HttpGet("chats")]
        public IActionResult Get([FromQuery] string id, [FromQuery] string type = "all")
        {
            try
            {
                List<Chats> UserChats = new();
                List<MessagesDTO> ChatsContent = new();

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
                        using (var ctx = new ApplicationDbContext(_srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                        {
                            AspNetUsers participants = new();
                            if (userChat.sender_id != id)
                            {
                                participants = ctx.AspNetUsers.Find(userChat.sender_id);
                            }
                            else
                            {
                                participants = ctx.AspNetUsers.Find(userChat.receiver_id);
                            }

                            MessagesDTO contents = System.Text.Json.JsonSerializer.Deserialize<MessagesDTO>(c.content);
                            contents.status = participants!.Status;

                            ChatsContent.Add(contents);
                        }
                    }

                }

                if (ChatsContent == null)
                {
                    return NotFound(new ResponseDTO<MessagesDTO> { Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
                }

                return Ok(new ResponseDTO<MessagesDTO> { User = ChatsContent });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Message = ErrorMessages.ErrorRegular, Error = ex.Message, StatusCode = 500 });
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
                return Ok(new ResponseDTO<object> { User = currentChats });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Message = ErrorMessages.ErrorRegular, Error = ex.Message, StatusCode = 500 });
            }
        }

        // POST chats/chat/create -- Ruta para creacion de un chat que tdv no exista
        [HttpPost("chat/create")]
        public async Task<IActionResult> Post([FromBody] ChatRequest data)
        {
            int messageSent = await _messageServices.createChat(data);
            if (messageSent <= 0)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<int> { SingleUser = messageSent });
        }

        // PUT chats/chat/send/{id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/send/{id}")]
        public async Task<IActionResult> Put([FromRoute] int id, [FromBody] ChatRequest data)
        {
            bool messageSent = await _messageServices.sendMessage(id, data);
            if (!messageSent)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<bool>());
        }
        // PUT chats/chat/read/{id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/read/{chat_id}")]
        public IActionResult PutMessageRead([FromRoute] int chat_id, [FromBody] ChatRequest data)
        {
            bool messageSent = _messageServices.readMessage(chat_id, data.sender_id);
            if (!messageSent)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<bool>());
        }
        // PUT chats/chat/manage/{id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/manage/{chat_id}")]
        public IActionResult PutManageChat([FromRoute] int chat_id, [FromBody] ChatRequest data)
        {
            bool managed = false;

            if (data.operation == "archive")
            {
                managed = _messageServices.archiveMessage(chat_id, data);

            }
            else if (data.operation == "favorite")
            {
                managed = _messageServices.favoriteMessage(chat_id, data);
            }

            if (!managed)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<bool>());
        }

        // DELETE chats/chat/delete/{id}/5 -- Ruta que borra o sale de un chat (PROXIMAMENTE)
        [HttpDelete("chat/delete/{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            return StatusCode(500, new ResponseDTO<Groups> { Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
        }

        // DELETE chats/chat/message/delete/5?user_id=user_id -- Ruta que borra o sale de un chat (PROXIMAMENTE)
        [HttpDelete("chat/message/delete/{id}")]
        public IActionResult DeleteSingleMessage([FromRoute] int id, [FromBody] ChatRequest data)
        {
            bool messageDeleted = _messageServices.deleteMessage(id, data);
            if (!messageDeleted)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<bool>());
        }
    }
}

