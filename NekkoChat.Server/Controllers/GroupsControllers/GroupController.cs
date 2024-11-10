using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using NekkoChat.Server.Data;
using Microsoft.EntityFrameworkCore;
using NekkoChat.Server.Models;
using NekkoChat.Server.Utils;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;
using NekkoChat.Server.Constants;
using NekkoChat.Server.Constants.Interfaces;
namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GroupController(
        ILogger<GroupController> logger, 
        ApplicationDbContext context,
        iGroupChatMessageService messageServices) : ControllerBase
    {
        private readonly ILogger<GroupController> _logger = logger;
        private readonly ApplicationDbContext _context = context;
        private readonly iGroupChatMessageService _messageServices = messageServices;

        // GET: groupschat/1 --- BUSCA TODAS LAS CONVERSACIONES DE EL USUARIO
        [HttpGet("chats")]
        public IActionResult Get([FromQuery] string user_id)
        {
            try
            {
                List<Groups_Members> GroupChats = new();
                List<object> ChatsContent = new();

                IQueryable<Groups_Members> conversations = from c in _context.groups_members select c;

                conversations = conversations.Where((c) => c.user_id == user_id);
                foreach (var conversation in conversations)
                {
                    GroupChats.Add(conversation);
                }

                foreach (var userChat in GroupChats)
                {
                    IQueryable<Groups_Messages> chat = from u in _context.groups_messages select u;
                    chat = chat.Where((u) => u.group_id == userChat.group_id);
                    foreach (var c in chat)
                    {
                        ChatsContent.Add(JsonDocument.Parse(c.content));
                    }
                }

                if (ChatsContent == null)
                {
                    return NotFound(new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
                }

                return Ok(new ResponseDTO<object> { User = ChatsContent });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ex.Message, StatusCode = 500 });
            }
        }

        // GET groupschat/chat/5 -- BUSCA UN CHAT ESPECIFICO
        [HttpGet("chat/{id}")]
        public IActionResult GetGroupByUserId([FromRoute] string id)
        {

            try
            {
                List<object> currentChats = new();
                int chat_id = int.Parse(id);
                IQueryable<Groups_Messages> chat = from u in _context.groups_messages select u;
                chat = chat.Where((u) => u.group_id == chat_id);

                foreach (var c in chat)
                {
                    currentChats.Add(JsonDocument.Parse(c.content));
                }

                return Ok(new ResponseDTO<object> { User = currentChats });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ex.Message, StatusCode = 500 });
            }
        }

        // /group/groups/{group_id}

        [HttpGet("groups/{group_id}")]
        public async Task<IActionResult> GetGroupById([FromRoute] int group_id)
        {
            try
            {
                Groups group = await _context.groups.FindAsync(group_id);

                return Ok(new ResponseDTO<Groups> { SingleUser = group });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ex.Message, StatusCode = 500 });
            }
        }

        // POST groupschat/chat/create-- Ruta para creacion de un chat que tdv no exista
        [HttpPost("chat/create")]
        public async Task<IActionResult> Post([FromBody] GroupRequest data)
        {
            int messageSent = await _messageServices.createChat(data);
            if (messageSent <= 0)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<int> { SingleUser = messageSent});
        }

        // PUT groupschat/chat/send/{id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/send/{id}")]
        public async Task<IActionResult> Put([FromBody] GroupRequest data)
        {
            bool messageSent = await _messageServices.sendMessage(data);
            if (!messageSent)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<Groups>());
        }


        // PUT groupschat/chat/read/{id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/read/{group_id}")]
        public IActionResult PutMessageRead([FromBody] GroupRequest data, [FromRoute] int group_id)
        {
            bool messageSent = _messageServices.readMessage(data, group_id);
            if (!messageSent)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<Groups>());
        }


        // PUT groupschat/chat/add/{id} --- Ruta para agregar nuevo integrante al grupo
        [HttpPut("chat/add/{group_id}")]
        public async Task<IActionResult> PutAddParticipant([FromBody] GroupRequest data, [FromRoute] int group_id)
        {
            bool messageSent = await _messageServices.addParticipantToGroup(data, group_id);
            if (!messageSent)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<Groups>());
        }

        // PUT groupschat/chat/manage/{id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/manage/{chat_id}")]
        public IActionResult PutManageChat([FromRoute] int group_id, [FromBody] ChatRequest data)
        {
            bool managed = false;

            if (data.operation == "archive")
            {
                managed = _messageServices.archiveMessage(group_id, data);

            }
            else if (data.operation == "favorite")
            {
                managed = _messageServices.favoriteMessage(group_id, data);
            }

            if (!managed)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }

            return Ok(new ResponseDTO<bool>());
        }

        // DELETE groupschat/chat/message/delete/5?user_id=user_id -- Ruta que borra o sale de un chat (PROXIMAMENTE)
        [HttpDelete("chat/message/delete/{id}")]
        public IActionResult DeleteSingleMessage([FromRoute] int id, [FromBody] ChatRequest data)
        {
            bool messageDeleted = _messageServices.deleteMessage(id, data);
            if (!messageDeleted)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<bool>());
        }

        // DELETE groupschat/chat/delete/{id}/5 -- Ruta que borra o sale de un chat (PROXIMAMENTE)
        [HttpDelete("chat/delete/{id}")]
        public void Delete(int id)
        {
        }
    }
}