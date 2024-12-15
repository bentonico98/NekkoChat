﻿using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using NekkoChat.Server.Data;
using NekkoChat.Server.Utils;
using NekkoChat.Server.Models;
using Microsoft.VisualBasic;
using System.Text.Json;
using NekkoChat.Server.Constants;
using static System.Runtime.InteropServices.JavaScript.JSType;
using NekkoChat.Server.Constants.Interfaces;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using System.Text;
using System.Collections;
// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ChatsController(
        ApplicationDbContext context,
        ILogger<ChatsController> logger,
        iMessageService messageServices,
        IServiceProvider srv,
        IDistributedCache cache) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;
        private readonly ILogger<ChatsController> _logger = logger;
        private readonly iMessageService _messageServices = messageServices;
        private readonly IServiceProvider _srv = srv;
        private readonly IDistributedCache _cache = cache;

        // GET: Chats/1 --- BUSCA TODAS LAS CONVERSACIONES DE EL USUARIO
        [HttpGet("chats")]
        public async Task<IActionResult> Get([FromQuery] string id, [FromQuery] string type = "all")
        {
            if (string.IsNullOrEmpty(id))
            {
                _logger.LogWarning("Id is null in Chat - Get All User Chat Route");
                return NotFound(new ResponseDTO<MessagesDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }

            try
            {
                List<Chats> UserChats = new();
                List<MessagesDTO> ChatsContent = new();
                string cacheKey = id + "privates";

                var cacheData = await _cache.GetAsync(cacheKey);
                if (cacheData is not null)
                {
                    var cacheDataString = Encoding.UTF8.GetString(cacheData);
                    ChatsContent = JsonSerializer.Deserialize<List<MessagesDTO>>(cacheDataString)!;
                }
                else
                {
                    IQueryable<Chats> conversations = _context.chats.Where(c => c.sender_id == id || c.receiver_id == id);

                    if (type == "favorites")
                    {
                        conversations = conversations
                            .Where((c) => c.isFavorite == true);
                    }
                    else if (type == "archived")
                    {
                        conversations = conversations
                            .Where((c) => c.isArchived == true);
                    }

                    foreach (var conversation in conversations)
                    {
                        UserChats.Add(conversation);
                    }

                    if (UserChats.Count() > 0)
                    {
                        await Task.Run(() =>
                        {
                            foreach (var userChat in UserChats)
                            {
                                IQueryable<Users_Messages> chat = _context.users_messages.Where((u) => u.chat_id == userChat.id);

                                if (chat.Any())
                                {
                                    foreach (var c in chat)
                                    {
                                        using (var ctx = new ApplicationDbContext(_srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                                        {
                                            AspNetUsers participants = new();
                                            if (userChat.sender_id != id)
                                            {
                                                if (!string.IsNullOrEmpty(userChat.sender_id))
                                                {
                                                    participants = ctx.AspNetUsers.Find(userChat.sender_id)!;
                                                }
                                            }
                                            else
                                            {
                                                if (!string.IsNullOrEmpty(userChat.receiver_id))
                                                {
                                                    participants = ctx.AspNetUsers.Find(userChat.receiver_id)!;
                                                }
                                            }

                                            if (c is not null && !string.IsNullOrEmpty(c.content))
                                            {
                                                MessagesDTO contents = System.Text.Json.JsonSerializer.Deserialize<MessagesDTO>(c.content)!;
                                                contents.status = participants!.Status;
                                                ChatsContent.Add(contents);
                                            }
                                        }
                                    }
                                }
                            }
                        });
                    }

                    if (ChatsContent == null)
                    {
                        _logger.LogWarning("Chat Content is null in Chat - Get All User Chat Route");
                        return NotFound(new ResponseDTO<MessagesDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
                    }

                    string cacheDataString = JsonSerializer.Serialize<List<MessagesDTO>>(ChatsContent);

                    var dataToCache = Encoding.UTF8.GetBytes(cacheDataString);

                    DistributedCacheEntryOptions cacheOpts = new DistributedCacheEntryOptions()
                        .SetAbsoluteExpiration(DateTime.Now.AddMinutes(2))
                        .SetSlidingExpiration(TimeSpan.FromMinutes(1));

                    await _cache.SetAsync(cacheKey, dataToCache, cacheOpts);
                }

                return Ok(new ResponseDTO<MessagesDTO> { User = ChatsContent });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " In Chats - Get All Users Chat Route");
                if (ex.InnerException is not null)
                {
                    _logger.LogError(ex?.InnerException?.Message + " In Chats - Get All Users Chat Route");
                }
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.ErrorMessage, StatusCode = 500 });
            }
        }

        // GET chats/chat/5 -- BUSCA UN CHAT ESPECIFICO
        [HttpGet("chat/{id}")]
        public async Task<IActionResult> GetChatByUserId([FromRoute] string id)
        {
            if (string.IsNullOrEmpty(id))
            {
                _logger.LogWarning("Id is null in Chat - Get All User Chat Route");
                return NotFound(new ResponseDTO<MessagesDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }

            try
            {
                int chat_id = int.Parse(id);

                List<MessagesDTO> currentChats = new();

                IQueryable<Users_Messages> chat = _context.users_messages.Where((u) => u.chat_id == chat_id);

                if (chat.Any())
                {
                    await Task.Run(() =>
                    {
                        foreach (var c in chat)
                        {
                            if (c is not null && !string.IsNullOrEmpty(c.content))
                            {
                                MessagesDTO payload = JsonSerializer.Deserialize<MessagesDTO>(c.content)!;
                                currentChats.Add(payload);
                            }
                        }
                    });
                }

                if (currentChats.Count() <= 0) return NotFound(new ResponseDTO<MessagesDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });

                return Ok(new ResponseDTO<MessagesDTO> { User = currentChats });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " In Chats - Get Specific Chat Route");
                if (ex.InnerException is not null)
                {
                    _logger.LogError(ex?.InnerException?.Message + " In Chats - Get Specific Chat Route");
                }
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.ErrorMessage, StatusCode = 500 });
            }
        }

        // POST chats/chat/create -- Ruta para creacion de un chat que tdv no exista
        [HttpPost("chat/create")]
        public async Task<IActionResult> Post([FromBody] ChatRequest data)
        {

            int messageSent = 0;

            if (ModelState.IsValid)
            {
                messageSent = await _messageServices.createChat(data);
            }

            if (messageSent <= 0)
            {
                _logger.LogWarning("Operation Failed in Chat - Create Chat Route");
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<int> { SingleUser = messageSent });
        }

        // PUT chats/chat/send/{id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/send/{id}")]
        public async Task<IActionResult> Put([FromRoute] int id, [FromBody] ChatRequest data)
        {
            if (id <= 0)
            {
                _logger.LogWarning("Id is null in Chat - Get Send Chat Route");
                return NotFound(new ResponseDTO<MessagesDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }

            bool messageSent = false;

            if (ModelState.IsValid)
            {
                messageSent = await _messageServices.sendMessage(id, data);
            }

            if (!messageSent)
            {
                _logger.LogWarning("Operation Failed in Chat - Send Chat Route");
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }

            return Ok(new ResponseDTO<bool>());
        }
        // PUT chats/chat/read/{id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/read/{chat_id}")]
        public IActionResult PutMessageRead([FromRoute] int chat_id, [FromBody] ChatRequest data)
        {
            if (chat_id <= 0 || string.IsNullOrEmpty(data.sender_id))
            {
                _logger.LogWarning("Id is null in Chat - Read Chat Route");
                return NotFound(new ResponseDTO<MessagesDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }

            bool messageSent = false;

            if (ModelState.IsValid)
            {
                messageSent = _messageServices.readMessage(chat_id, data.sender_id);
            }

            if (!messageSent)
            {
                _logger.LogWarning("Operation Failed in Chat - Read Chat Route");
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }

            return Ok(new ResponseDTO<bool>());
        }
        // PUT chats/chat/manage/{id} --- Ruta para envio de mensaje a un chat existente
        [HttpPut("chat/manage/{chat_id}")]
        public IActionResult PutManageChat([FromRoute] int chat_id, [FromBody] ChatRequest data)
        {
            if (chat_id <= 0)
            {
                _logger.LogWarning("Id is null in Chat - Read Chat Route");
                return NotFound(new ResponseDTO<MessagesDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }
            bool managed = false;

            if (ModelState.IsValid)
            {
                if (data.operation == "archive")
                {
                    managed = _messageServices.archiveMessage(chat_id, data);

                }
                else if (data.operation == "favorite")
                {
                    managed = _messageServices.favoriteMessage(chat_id, data);
                }
            }

            if (!managed)
            {
                _logger.LogWarning("Operation Failed in Chat - Manage Chat Route");
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }

            return Ok(new ResponseDTO<bool>());
        }

        // DELETE chats/chat/delete/{id}/5 -- Ruta que borra o sale de un chat (PROXIMAMENTE)
        [HttpPatch("chat/delete/{id}")]
        public IActionResult Delete([FromRoute] int id)
        {
            return StatusCode(403, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoDeleteActiveChat, StatusCode = 403 });
        }

        // DELETE chats/chat/message/delete/5?user_id=user_id -- Ruta que borra o sale de un chat (PROXIMAMENTE)
        [HttpPatch("chat/message/delete/{id}")]
        public async Task<IActionResult> DeleteSingleMessage([FromRoute] int id, [FromBody] ChatRequest data)
        {
            if (id <= 0)
            {
                _logger.LogWarning("Id is null in Chat - Read Chat Route");
                return NotFound(new ResponseDTO<MessagesDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }

            bool messageDeleted = false;

            if (ModelState.IsValid)
            {
                messageDeleted = await _messageServices.deleteMessage(id, data);
            }

            if (!messageDeleted)
            {
                _logger.LogWarning("Operation Failed in Chat - Get Delete Message Chat Route");
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
            return Ok(new ResponseDTO<bool>());
        }
    }
}

