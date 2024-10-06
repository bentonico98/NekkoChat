using Microsoft.AspNetCore.Mvc;
using System;
using Elastic.Clients.Elasticsearch;
using Elastic.Clients.Elasticsearch.QueryDsl;
using System.Globalization;
using Elastic.Transport;
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
