using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using NekkoChat.Server.Data;
using Microsoft.EntityFrameworkCore;
using NekkoChat.Server.Models;
using NekkoChat.Server.Utils;
using System.Text.Json;
namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GroupController(ILogger<GroupController> logger, ApplicationDbContext context) : ControllerBase
    {
        private readonly ILogger<GroupController> _logger = logger;
        private readonly ApplicationDbContext _context = context;
        private readonly GroupChatMessageServices _messageServices = new GroupChatMessageServices(context);

        // GET: groupschat/1 --- BUSCA TODAS LAS CONVERSACIONES DE EL USUARIO
        [HttpGet("chats")]
        public IActionResult Get(string user_id)
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
                    return NotFound(new { Message = "No index found" });
                }

                return Ok(ChatsContent);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
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
                return Ok(currentChats);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }

        // /group/groups/group_id

        [HttpGet("groups/{group_id}")]
        public async Task<IActionResult> GetGroupById(int group_id)
        {
            try
            {
                Groups group = await _context.groups.FindAsync(group_id);
                return Ok(group);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }

        // POST groupschat/chat/create?sender_id=${sender_id}&groupname=${groupname}&grouptype=${grouptype}&groupdesc=${groupdesc}&groupphoto=${groupphoto}&value=${value} -- Ruta para creacion de un chat que tdv no exista
        [HttpPost("chat/create")]
        public async Task<IActionResult> Post(string value, string sender_id, int group_id, string groupname, string grouptype, string groupdesc, string groupphoto)
        {
            int messageSent = await _messageServices.createChat(sender_id, group_id, groupname, grouptype, groupdesc, groupphoto,value);
            if (messageSent <= 0)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message" });
            }
            return Ok();
        }

        // PUT groupschat/chat/send/{id}?sender_id=${sender_id}&groupname=${groupname}&grouptype=${grouptype}&groupdesc=${groupdesc}&groupphoto=${groupphoto}&value=${value}--- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/send/{id}")]
        public async Task<IActionResult> Put(int id, string value, string sender_id, string groupname, string grouptype, string groupdesc, string groupphoto)
        {
            bool messageSent = await _messageServices.sendMessage(id, sender_id, groupname, grouptype, groupdesc, groupphoto, value);
            if (!messageSent)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message" });
            }
            return Ok();
        }


        // PUT groupschat/chat/read/{id}?sender_id=${sender_id}&groupname=groupname --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/read/{group_id}")]
        public IActionResult PutMessageRead(int group_id, string sender_id, string groupname)
        {
            bool messageSent = _messageServices.readMessage(group_id, sender_id, groupname);
            if (!messageSent)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message" });
            }
            return Ok();
        }


        // PUT groupschat/chat/add/{id}?sender_id=${sender_id}&groupname=groupname --- Ruta para agregar nuevo integrante al grupo
        [HttpPut("chat/add/{group_id}")]
        public async Task< IActionResult> PutAddParticipant(int group_id, string sender_id, string groupname)
        {
            bool messageSent = await _messageServices.addParticipantToGroup(sender_id, group_id, groupname);
            if (!messageSent)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = "Unable to send message" });
            }
            return Ok();
        }


        // DELETE groupschat/chat/delete/{id}/5 -- Ruta que borra o sale de un chat (PROXIMAMENTE)
        [HttpDelete("chat/delete/{id}")]
        public void Delete(int id)
        {
        }
    }
}