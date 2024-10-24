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

namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController(ILogger<UserController> logger, ApplicationDbContext context, IMapper mapper, IServiceProvider serviceProvider) : ControllerBase
    {
        private readonly ILogger<UserController> _logger = logger;
        private readonly ApplicationDbContext _context = context;
        private readonly IMapper _mapper = mapper;

        // /User/users?user_id=""

        [HttpGet("users")]
        public async Task<IActionResult> Get(string user_id)
        {
            try
            {
                AspNetUsers user = await _context.AspNetUsers.FindAsync(user_id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }

        [HttpGet("user")]
        public IActionResult GetUserByName(string name)
        {

            try
            {

                List<AspNetUsers> searchRes = new();

                var user = _context.AspNetUsers.FirstOrDefault((c) => c.UserName.Contains(name));
                IQueryable<AspNetUsers> results = from c in _context.AspNetUsers select c;
                results = results.Where((c) => c.UserName.Contains(name));

                foreach (var search in results)
                {
                    searchRes.Add(search);
                }

                object payload = new { success = true, user = searchRes };

                return Ok(payload);

            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }

        }
        [HttpGet("friends")]
        public IActionResult GetUserFriends([FromQuery] string user_id)
        {
            try
            {
                List<UserDTO> friendsList = new();

                IQueryable<Friend_List> friends = from fr in _context.friend_list select fr;
                friends = friends.Where((fr) => fr.receiver_id == user_id);

                foreach (var friend in friends)
                {
                    using (var ctx = new ApplicationDbContext(serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                    {
                        AspNetUsers user = ctx.AspNetUsers.Find(friend.sender_id);
                        if (!string.IsNullOrEmpty(user!.Id))
                        {
                            var config = new MapperConfiguration(cfg => cfg.CreateMap<AspNetUsers, UserDTO>());
                            var mapper = new Mapper(config);
                            UserDTO userView = mapper.Map<UserDTO>(user);
                            friendsList.Add(userView);
                        }
                    }
                    
                }

                //object payload = new { success = true, user = friendsList };

                return Ok(new ResponseDTO<UserDTO> { Success = true, User = friendsList, StatusCode = 200 });

            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<AspNetUsers> { Message = "An error ocurred", Error = ex.Message, StatusCode= 500 });
            }

        }
        [HttpPost("manage/friendrequest/send")]
        public async Task<IActionResult> PostFriendRequest([FromBody] UserRequest data)
        {
            try
            {
                AspNetUsers sender = await _context.AspNetUsers.FindAsync(data.sender_id);
                AspNetUsers receiver = await _context.AspNetUsers.FindAsync(data.receiver_id);

                if (sender == null || receiver == null) return StatusCode(403, new { Message = "User Doesnt Exist", Error = "Invalid User" });

                try
                {
                    Friend_List friendReq = new Friend_List
                    {
                        sender_id = sender.Id,
                        receiver_id = receiver.Id,
                        isAccepted = false
                    };
                    _context.friend_list.Add(friendReq);
                    _context.SaveChanges();
                    return Ok();

                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }

        [HttpPatch("manage/friendrequest/response")]
        public async Task<IActionResult> PatchFriendRequest([FromBody] UserRequest data)
        {
            try
            {
                try
                {
                    Friend_List friendReq = await _context.friend_list.FirstOrDefaultAsync((fr) => fr.sender_id == data.sender_id && fr.receiver_id == data.receiver_id);

                    if (data.operation == "accept" && friendReq!.id > 0)
                    {
                        friendReq.isAccepted = true;
                        _context.friend_list.Update(friendReq);
                    }
                    else if (data.operation == "decline" && friendReq!.id > 0)
                    {
                        _context.RemoveRange(friendReq);
                    }
                    else
                    {
                        return BadRequest();
                    }

                    _context.SaveChanges();
                    return Ok();

                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }

        [HttpPost("manage/connectionid")]
        public async Task<IActionResult> Post(string user_id, string connectionid)
        {
            try
            {
                AspNetUsers user = await _context.AspNetUsers.FindAsync(user_id);
                user!.ConnectionId = connectionid;
                user!.Status = ValidStatus.Valid_Status.available;
                _context.AspNetUsers.UpdateRange(user);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }

        [HttpPut("manage/status")]
        public async Task<IActionResult> Put(string user_id, int status)
        {
            try
            {
                AspNetUsers user = await _context.AspNetUsers.FindAsync(user_id);
                user!.Status = (ValidStatus.Valid_Status)status;
                _context.AspNetUsers.UpdateRange(user);
                _context.SaveChanges();
                return Ok();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }
    }
}
