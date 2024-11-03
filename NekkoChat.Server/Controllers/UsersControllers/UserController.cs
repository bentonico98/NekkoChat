using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using Elasticsearch.Net;
using Nest;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Constants.Types;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using NekkoChat.Server.Constants;
using static System.Runtime.InteropServices.JavaScript.JSType;
using NekkoChat.Server.Utils;
using NekkoChat.Server.Constants.Interfaces;

namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController(
        ILogger<UserController> logger,
        ApplicationDbContext context,
        IMapper mapper,
        IServiceProvider serviceProvider,
        iFriendRequestService friendProvider) : ControllerBase
    {
        private readonly ILogger<UserController> _logger = logger;
        private readonly ApplicationDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly iFriendRequestService _friendProvider = friendProvider;


        // /User/users?user_id="user_id"

        [HttpGet("users")]
        public async Task<IActionResult> Get([FromQuery] string user_id, [FromQuery] string sender_id)
        {
            try
            {
                AspNetUsers user = await _context.AspNetUsers.FindAsync(user_id);
                UserDTO userView = _mapper.Map<UserDTO>(user);
                using (var ctx = new ApplicationDbContext(serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                {
                    Friend_List friendsList = ctx.friend_list.Where((c) =>
                    c.sender_id == userView.Id && c.receiver_id == sender_id && c.isAccepted == true
                    ||
                    c.sender_id == sender_id && c.receiver_id == userView.Id && c.isAccepted == true).FirstOrDefault();
                    
                    if(friendsList is not null)
                    {
                        userView.isFriend = (bool)friendsList!.isAccepted;
                    }
                }
                using (var ctx = new ApplicationDbContext(serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                {
                    bool isSender = ctx.friend_list.Any((f) => f.sender_id == userView.Id && f.isAccepted == false);
                    userView.isSender = (bool)isSender || false;
                }
                return Ok(new ResponseDTO<UserDTO> { Success = true, SingleUser = userView, StatusCode = 200 });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<UserDTO> { Message = ErrorMessages.ErrorMessage, Error = ex.Message, StatusCode = 500 });
            }
        }

        [HttpGet("user")]
        public IActionResult GetUserByName([FromQuery] string name)
        {

            try
            {
                List<UserDTO> searchRes = new();

                //var user = _context.AspNetUsers.FirstOrDefault((c) => c.UserName.Contains(name.ToLower()));
                IQueryable<AspNetUsers> results = from c in _context.AspNetUsers select c;
                results = results.Where((c) => c.UserName!.ToLower().Contains(name.ToLower()));

                foreach (var search in results)
                {
                    UserDTO userView = _mapper.Map<UserDTO>(search);
                    searchRes.Add(userView);
                }

                return Ok(new ResponseDTO<UserDTO> { Success = true, User = searchRes, StatusCode = 200 });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<AspNetUsers> { Message = ErrorMessages.ErrorRegular, Error = ex.Message, StatusCode = 500 });
            }

        }
        [HttpGet("friends")]
        public IActionResult GetUserFriends([FromQuery] string user_id, [FromQuery] string operation)
        {
            try
            {
                List<UserDTO> friendsList = new();

                IQueryable<Friend_List> friends = from fr in _context.friend_list select fr;
                if (operation == "requests")
                {
                    friends = friends.Where((fr) => fr.receiver_id == user_id && fr.isAccepted == false);
                    if(!friends.Any())
                    {
                        IQueryable<Friend_List>  altFriends = _context.friend_list.Where((fr) => fr.sender_id == user_id && fr.isAccepted == false);
                        foreach (var altFriend in altFriends)
                        {
                            using (var ctx = new ApplicationDbContext(serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                            {
                                AspNetUsers user =  ctx.AspNetUsers.Find(altFriend.receiver_id);

                                if (!string.IsNullOrEmpty(user!.Id))
                                {
                                    UserDTO userView = _mapper.Map<UserDTO>(user);
                                    if (operation == "requests")
                                    {
                                        userView.isFriend = false;
                                        userView.isSender = true;
                                    }
                                    else
                                    {
                                        userView.isFriend = true;
                                    }
                                    friendsList.Add(userView);
                                }
                            }
                        }
                        return Ok(new ResponseDTO<UserDTO> { Success = true, User = friendsList, StatusCode = 200 });
                    }
                }
                else
                {
                    friends = friends.Where((fr) => fr.receiver_id == user_id && fr.isAccepted == true);
                    if (!friends.Any())
                    {
                        IQueryable<Friend_List> altFriends2 = _context.friend_list.Where((fr) => fr.sender_id == user_id && fr.isAccepted == true);
                        foreach (var altFriend in altFriends2)
                        {
                            using (var ctx = new ApplicationDbContext(serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                            {
                                AspNetUsers user = ctx.AspNetUsers.Find(altFriend.receiver_id);

                                if (!string.IsNullOrEmpty(user!.Id))
                                {
                                    UserDTO userView = _mapper.Map<UserDTO>(user);
                                    if (operation == "requests")
                                    {
                                        userView.isFriend = false;
                                        userView.isSender = true;
                                    }
                                    else
                                    {
                                        userView.isFriend = true;
                                    }
                                    friendsList.Add(userView);
                                }
                            }
                        }
                        return Ok(new ResponseDTO<UserDTO> { Success = true, User = friendsList, StatusCode = 200 });

                    }
                }

                foreach (var friend in friends)
                {
                    using (var ctx = new ApplicationDbContext(serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                    {
                        AspNetUsers user =  ctx.AspNetUsers.Find(friend.sender_id);

                        if (!string.IsNullOrEmpty(user!.Id))
                        {
                            UserDTO userView = _mapper.Map<UserDTO>(user);
                            if (operation == "requests")
                            {
                                userView.isFriend = false;
                                userView.isSender = true;
                            }
                            else
                            {
                                userView.isFriend = true;
                            }
                            friendsList.Add(userView);
                        }
                    }
                }

                return Ok(new ResponseDTO<UserDTO> { Success = true, User = friendsList, StatusCode = 200 });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<AspNetUsers> { Message = ErrorMessages.ErrorRegular, Error = ex.Message, StatusCode = 500 });
            }
        }

        [HttpPost("manage/friendrequest/send")]
        public async Task<IActionResult> PostFriendRequest([FromBody] UserRequest data)
        {
            if (string.IsNullOrEmpty(data.receiver_id) || string.IsNullOrEmpty(data.sender_id))
            {
                return BadRequest(new ResponseDTO<Friend_List> { Message = ErrorMessages.ErrorMessage, Error = ErrorMessages.MissingValues, StatusCode = 400 });
            }

            AspNetUsers sender = await _context.AspNetUsers.FindAsync(data.sender_id);
            AspNetUsers receiver = await _context.AspNetUsers.FindAsync(data.receiver_id);

            if (sender == null || receiver == null) return StatusCode(403, new ResponseDTO<Friend_List> { Message = "User " + ErrorMessages.NoExist, Error = ErrorMessages.Invalid + " User." });

            try
            {
                Friend_List friendReq = new Friend_List
                {
                    sender_id = sender.Id,
                    receiver_id = receiver.Id,
                    isAccepted = false
                };
                await _context.friend_list.AddAsync(friendReq);
                await _context.SaveChangesAsync();
                return Ok(new ResponseDTO<UserDTO>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<Friend_List> { Message = ErrorMessages.ErrorMessage, Error = ex.Message });
            }

        }

        [HttpPatch("manage/friendrequest/response")]
        public async Task<IActionResult> PatchFriendRequest([FromBody] UserRequest data)
        {
            if (string.IsNullOrEmpty(data.receiver_id) || string.IsNullOrEmpty(data.sender_id))
            {
                return BadRequest(new ResponseDTO<Friend_List> { Message = ErrorMessages.ErrorMessage, Error = ErrorMessages.MissingValues, StatusCode = 400 });
            }

            try
            {
                Friend_List friendReq = await _context.friend_list.FirstOrDefaultAsync((fr) =>
                fr.sender_id == data.sender_id && fr.receiver_id == data.receiver_id
                ||
                fr.sender_id == data.receiver_id && fr.receiver_id == data.sender_id);

                if (data.operation == "accept" && friendReq!.id > 0)
                {
                    friendReq.isAccepted = true;
                    _context.friend_list.Update(friendReq);
                    _friendProvider.IncreaseFriendCount(data.sender_id, serviceProvider);
                    _friendProvider.IncreaseFriendCount(data.receiver_id, serviceProvider);
                }
                else if (data.operation == "decline" && friendReq!.id > 0)
                {
                    _context.RemoveRange(friendReq);
                }
                else if (data.operation == "remove" && friendReq!.id > 0)
                {
                    friendReq.isAccepted = false;
                    _context.friend_list.Update(friendReq);
                    _context.RemoveRange(friendReq);

                    _friendProvider.DecreaseFriendCount(data.sender_id, serviceProvider);
                    _friendProvider.DecreaseFriendCount(data.receiver_id, serviceProvider);
                }
                else
                {
                    return BadRequest(new ResponseDTO<Friend_List> { Message = ErrorMessages.ErrorMessage, Error = ErrorMessages.ErrorRegular, StatusCode = 400 });
                }

                await _context.SaveChangesAsync();
                return Ok(new ResponseDTO<UserDTO>());

            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<Friend_List> { Message = ErrorMessages.ErrorMessage, Error = ex.Message, StatusCode = 500 });
            }
        }

        [HttpPost("manage/connectionid")]
        public async Task<IActionResult> Post([FromBody] UserRequest data)
        {
            try
            {
                AspNetUsers user = await _context.AspNetUsers.FindAsync(data.user_id);
                user!.ConnectionId = data.connectionid;
                user!.Status = ValidStatus.Valid_Status.available;
                _context.AspNetUsers.UpdateRange(user);
                await _context.SaveChangesAsync();
                return Ok(new ResponseDTO<UserDTO>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<AspNetUsers> { Message = ErrorMessages.ErrorRegular, Error = ex.Message, StatusCode = 500 });
            }
        }

        [HttpPut("manage/status")]
        public async Task<IActionResult> Put([FromBody] UserRequest data, [FromQuery] int status)
        {
            try
            {
                AspNetUsers user = await _context.AspNetUsers.FindAsync(data.user_id);
                user!.Status = (ValidStatus.Valid_Status)status;
                _context.AspNetUsers.UpdateRange(user);
                await _context.SaveChangesAsync();
                return Ok(new ResponseDTO<UserDTO>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<AspNetUsers> { Message = ErrorMessages.ErrorRegular, Error = ex.Message, StatusCode = 500 });
            }
        }
    }
}
