using Microsoft.AspNetCore.Mvc;
using System;
using System.Globalization;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Constants.Types;
using Microsoft.EntityFrameworkCore;
using NekkoChat.Server.Utils;
using NekkoChat.Server.Constants;

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
            if (string.IsNullOrEmpty(user_id))
            {
                _logger.LogWarning("User Id is null in Occurred In Video Route");
                return NotFound(new ResponseDTO<object> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist });

            }
            try
            {
                var user = await _videocallServices.GetFriendsAsync(user_id);
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " Occurred In Video Route");
                return StatusCode(500, new ResponseDTO<object> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.ErrorMessage });
            }
        }
    }
}
