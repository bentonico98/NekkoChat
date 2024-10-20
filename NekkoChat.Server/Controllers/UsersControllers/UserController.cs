using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using Elasticsearch.Net;
using Nest;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Constants.Types;

namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class UserController(ILogger<UserController> logger, ApplicationDbContext context) : ControllerBase
    {
        private readonly ILogger<UserController> _logger = logger;
        private readonly ApplicationDbContext _context = context;
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
        public IActionResult GetUserByName(string name) {

            try {

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
            
            } catch (Exception ex) {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }

        }
        [HttpPost("manage/friendrequest")]
        public async Task<IActionResult> PostFriendRequest(string sender_id, string receiver_id)
        {
            try
            {
                AspNetUsers sender = await _context.AspNetUsers.FindAsync(sender_id);
                AspNetUsers receiver = await _context.AspNetUsers.FindAsync(receiver_id);

                if (sender == null || receiver == null) return StatusCode(403, new { Message = "User Doesnt Exist", Error = "Invalid User" });

                try {
                    Friend_List friendReq = new Friend_List { 
                        sender_id = sender.Id, 
                        receiver_id = receiver.Id, 
                        isAccepted = false 
                    };
                    _context.friend_list.Add(friendReq);
                    _context.SaveChanges();
                    return Ok();

                } catch (Exception ex) {
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
