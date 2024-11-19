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
using Nest;
using NekkoChat.Server.Schemas;
using AutoMapper;
namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class GroupController(
        ILogger<GroupController> logger,
        ApplicationDbContext context,
        iGroupChatMessageService messageServices,
        IMapper mapper,
        IServiceProvider srv) : ControllerBase
    {
        private readonly ILogger<GroupController> _logger = logger;
        private readonly ApplicationDbContext _context = context;
        private readonly iGroupChatMessageService _messageServices = messageServices;
        private readonly IMapper _mapper = mapper;


        // GET: groupschat/1 --- BUSCA TODAS LAS CONVERSACIONES DE EL USUARIO
        [HttpGet("chats")]
        public async Task<IActionResult> Get([FromQuery] string user_id)
        {
            if (string.IsNullOrEmpty(user_id))
            {
                _logger.LogWarning("User Id is null in Group - Get All User Chats Route");
                return NotFound(new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }

            try
            {
                List<Groups_Members> GroupChats = new();
                List<GroupMessageSchemas> ChatsContent = new();

                IQueryable<Groups_Members> conversations = from c in _context.groups_members select c;

                conversations = conversations.Where((c) => c.user_id == user_id);

                await Task.Run(() =>
                {
                    foreach (var conversation in conversations)
                    {
                        GroupChats.Add(conversation);
                    }

                    if (GroupChats.Count() > 0)
                    {
                        foreach (var userChat in GroupChats)
                        {
                            IQueryable<Groups_Messages> chat = from u in _context.groups_messages select u;
                            chat = chat.Where((u) => u.group_id == userChat.group_id);

                            foreach (var c in chat)
                            {
                                if (c is not null && !string.IsNullOrEmpty(c.content))
                                {
                                    GroupMessageSchemas payload = JsonSerializer.Deserialize<GroupMessageSchemas>(c.content)!;
                                    ChatsContent.Add(payload);
                                }
                            }
                        }
                    }
                });

                if (ChatsContent == null)
                {
                    return NotFound(new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
                }

                return Ok(new ResponseDTO<GroupMessageSchemas> { User = ChatsContent });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " In Groups - Get All Users Chat Route");
                if (ex.InnerException is not null)
                {
                    _logger.LogError(ex?.InnerException?.Message + " In Groups - Get All Users Chat Route");
                }
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.ErrorMessage, StatusCode = 500 });
            }
        }

        // GET groupschat/chat/5 -- BUSCA UN CHAT ESPECIFICO
        [HttpGet("chat/{id}")]
        public async Task<IActionResult> GetGroupByUserId([FromRoute] string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                _logger.LogWarning("Id is Null in Group - Get Specific Route");
                return NotFound(new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }

            try
            {
                List<GroupMessageSchemas> currentChats = new();

                int chat_id = int.Parse(id);

                IQueryable<Groups_Messages> chat = from u in _context.groups_messages select u;
                chat = chat.Where((u) => u.group_id == chat_id);

                await Task.Run(() =>
                {
                    foreach (var c in chat)
                    {
                        if (c is not null && !string.IsNullOrEmpty(c.content))
                        {
                            GroupMessageSchemas payload = JsonSerializer.Deserialize<GroupMessageSchemas>(c.content)!;
                            currentChats.Add(payload);
                        }
                    }
                });

                if (currentChats.Count() <= 0) return NotFound(new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });

                return Ok(new ResponseDTO<GroupMessageSchemas> { User = currentChats });

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " In Groups - Get Specific Chat Route");
                if (ex.InnerException is not null)
                {
                    _logger.LogError(ex?.InnerException?.Message + " In Groups - Get Specific Chat Route");
                }
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.ErrorMessage, StatusCode = 500 });
            }
        }

        // /group/groups/{group_id}
        [HttpGet("groups/{group_id}")]
        public async Task<IActionResult> GetGroupById([FromRoute] int group_id)
        {
            if (group_id <= 0)
            {
                _logger.LogWarning("Group Id is null in Group - Get Specific Group Route");
                return NotFound(new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }
            try
            {
                var group = await _context.groups.FindAsync(group_id);
                List<string> participantsIds = new();
                List<ParticipantsSchema> participants = new();

                if (group is null) return NotFound(new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });

                IQueryable<Groups_Members> participantsList = _context.groups_members.Where((gm) => gm.group_id == group_id);

                await Task.Run(async () =>
                {
                    if (participantsList.Any())
                    {
                        foreach (var p in participantsList)
                        {
                            if (p is not null && !string.IsNullOrEmpty(p.user_id))
                            {
                                participantsIds.Add(p.user_id);
                            }
                        }
                    }

                    if (participantsIds.Count() > 0)
                    {
                        foreach (var p in participantsIds)
                        {
                            using (var ctx = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                            {
                                var user = await ctx.AspNetUsers.FindAsync(p)!;
                                if (user is not null)
                                {
                                    ParticipantsSchema userView = new ParticipantsSchema
                                    {
                                        id = user.Id,
                                        name = $"{user.Fname} {user.Lname}",
                                        connectionid = !string.IsNullOrEmpty(user.ConnectionId) ? user.ConnectionId : "",
                                        profilePic = !string.IsNullOrEmpty(user.ProfilePhotoUrl) ? user.ProfilePhotoUrl : "/src/assets/avatar.png"
                                    };
                                    participants.Add(userView);
                                }
                            }
                        }
                    }
                });

                GroupDTO groupView = new GroupDTO
                {
                    id = group.id,
                    name = !string.IsNullOrEmpty(group.name) ? group.name : "",
                    description = group.description,
                    type = !string.IsNullOrEmpty(group.type) ? group.type : "",
                    profilePhotoUrl = group.profilePhotoUrl
                };
                groupView.participants = participants.ToArray();

                return Ok(new ResponseDTO<GroupDTO> { SingleUser = groupView });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " In Groups - Get Specific Group Route");
                if (ex.InnerException is not null)
                {
                    _logger.LogError(ex?.InnerException?.Message + " In Groups - Get Specific Group Route");
                }
                return StatusCode(500, new ResponseDTO<GroupDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.ErrorMessage, StatusCode = 500 });
            }
        }

        // POST groupschat/chat/create-- Ruta para creacion de un chat que tdv no exista
        [HttpPost("chat/create")]
        public async Task<IActionResult> Post([FromBody] GroupRequest data)
        {
            int messageSent = 0;

            if (ModelState.IsValid)
            {
                messageSent = await _messageServices.createChat(data);
            }
            if (messageSent <= 0)
            {
                _logger.LogWarning("Operation Failed in Group - Create Group Route");
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<int> { SingleUser = messageSent });
        }

        // PUT groupschat/chat/send/{id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/send/{id}")]
        public async Task<IActionResult> Put([FromBody] GroupRequest data)
        {
            bool messageSent = false;

            if (ModelState.IsValid)
            {
                messageSent = await _messageServices.sendMessage(data);
            }
            if (!messageSent)
            {
                _logger.LogWarning("Operation Failed in Group - Send Group Route");
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<Groups>());
        }


        // PUT groupschat/chat/read/{id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/read/{group_id}")]
        public IActionResult PutMessageRead([FromBody] GroupRequest data, [FromRoute] int group_id)
        {
            if (group_id <= 0)
            {
                _logger.LogWarning("Id is Null in Group - Read Group Route");
                return NotFound(new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }

            bool messageSent = false;

            if (ModelState.IsValid)
            {
                messageSent = _messageServices.readMessage(data, group_id);
            }

            if (!messageSent)
            {
                _logger.LogWarning("Operation Failed in Group - Read Group Route");
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<Groups>());
        }


        // PUT groupschat/chat/add/{id} --- Ruta para agregar nuevo integrante al grupo
        [HttpPut("chat/add/{group_id}")]
        public async Task<IActionResult> PutAddParticipant([FromBody] GroupRequest data, [FromRoute] int group_id)
        {
            if (group_id <= 0)
            {
                _logger.LogWarning("Id is Null in Group - Add To Group Route");
                return NotFound(new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }

            bool messageSent = false;

            if (ModelState.IsValid)
            {
                messageSent = await _messageServices.addParticipantToGroup(data, group_id);
            }

            if (!messageSent)
            {
                _logger.LogWarning("Operation Failed in Group - Add To Group Route");
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }

            return Ok(new ResponseDTO<Groups>());
        }

        // PUT groupschat/chat/manage/{id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/manage/{chat_id}")]
        public IActionResult PutManageChat([FromRoute] int group_id, [FromBody] ChatRequest data)
        {
            if (group_id <= 0)
            {
                _logger.LogWarning("Id is Null in Group - Manage Route");
                return NotFound(new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }

            bool managed = false;

            if (ModelState.IsValid)
            {
                if (data.operation == "archive")
                {
                    managed = _messageServices.archiveMessage(group_id, data);

                }
                else if (data.operation == "favorite")
                {
                    managed = _messageServices.favoriteMessage(group_id, data);
                }
            }

            if (!managed)
            {
                _logger.LogWarning("Operation Failed in Group - Manage Route");
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }

            return Ok(new ResponseDTO<bool>());
        }

        // DELETE groupschat/chat/message/delete/5?user_id=user_id -- Ruta que borra o sale de un chat (PROXIMAMENTE)
        [HttpDelete("chat/message/delete/{id}")]
        public IActionResult DeleteSingleMessage([FromRoute] int id, [FromBody] ChatRequest data)
        {
            if (id <= 0)
            {
                _logger.LogWarning("Id is Null in Group - Delete Message Route");
                return NotFound(new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }

            bool messageDeleted = false;

            if (ModelState.IsValid)
            {
                messageDeleted = _messageServices.deleteMessage(id, data);
            }

            if (!messageDeleted)
            {
                _logger.LogWarning("Operation Failed in Group - Delete Message Route");
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