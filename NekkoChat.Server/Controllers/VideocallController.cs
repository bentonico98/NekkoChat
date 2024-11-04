using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using Elasticsearch.Net;
using Nest;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Constants.Types;
using Microsoft.EntityFrameworkCore;
using NekkoChat.Server.Utils;

namespace NekkoChat.Server.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class VideocallController(ILogger<UserController> logger, ApplicationDbContext context) : ControllerBase
    {
        private readonly ILogger<UserController> _logger = logger;
        private readonly ApplicationDbContext _context = context;
        private readonly VideocallServices _videocallServices = new VideocallServices(context);


        [HttpGet("users/")]
        public async Task<IActionResult> Get(string user_id)
        {
            try
            {
                 var user = await _videocallServices.GetFriendsAsync(user_id);

                return Ok(user);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error ocurred", Error = ex.Message });
            }
        }
    }
}
