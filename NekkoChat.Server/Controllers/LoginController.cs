using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NekkoChat.Server.Constants.Types;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;
using static System.Runtime.InteropServices.JavaScript.JSType;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NekkoChat.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LoginController(SignInManager<AspNetUsers> signInManager, UserManager<AspNetUsers> userManager, ApplicationDbContext context) : ControllerBase
    {
        private readonly SignInManager<AspNetUsers> _signInManager = signInManager;
        private readonly UserManager<AspNetUsers> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;

        // POST /login
        [HttpPost("/login")]
        public async Task<IActionResult> Login([FromBody] LoginSchemas data)
        {
            if (ModelState.IsValid)
            {
                AspNetUsers user = await _userManager.FindByEmailAsync(data.username);
                try
                {
                    var date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    user!.LastOnline = date;
                    user!.Status = ValidStatus.Valid_Status.available;

                    var result = await _signInManager.PasswordSignInAsync(user, data!.password, isPersistent: true, lockoutOnFailure: false);

                    if (result.Succeeded)
                    {
                        object payload = new { success = true, user = user };
                        _context.AspNetUsers.Update(user);
                        _context.SaveChanges();
                        return Ok(payload);
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { success = false, Message = ex.Message, InternalMessage = ex?.InnerException?.Message, Error = "Please, All fiels are required." });
                }
            }
            return StatusCode(500, new { success = false, Message = "An error ocurred", Error = "Please, All fiels are required." });
        }

        // POST /login
        [HttpPost("/register")]
        public async Task<IActionResult> Register([FromBody] RegisterSchemas data)
        {
            if (ModelState.IsValid)
            {
                var date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                AspNetUsers user = new AspNetUsers { Email = data.email, UserName = data.username, EmailConfirmed = true, PhoneNumber = data.phoneNumber, PhoneNumberConfirmed = true, LastOnline = date, Status = ValidStatus.Valid_Status.available };
                var userCreated = await _userManager.CreateAsync(user, data.password);

                if (userCreated.Succeeded)
                {
                    await _signInManager.SignInAsync(user, isPersistent: false);
                    object payload = new { success = true, user = user };
                    return Ok(payload);
                }
            }
            return StatusCode(500, new { success = false, Message = "An error ocurred", Error = "Please, All fiels are required." });
        }

        // DELETE /logout/5
        [HttpPut("/logout")]
        public async Task<IActionResult> Logout(string user_id)
        {
            if (ModelState.IsValid)
            {
                AspNetUsers user = await _userManager.FindByIdAsync(user_id);
                try
                {
                    user!.Status = ValidStatus.Valid_Status.unavailable;

                    await _signInManager.SignOutAsync();

                    object payload = new { success = true };

                    _context.AspNetUsers.Update(user);
                    _context.SaveChanges();

                    return Ok(payload);
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { success = false, Message = ex.Message, InternalMessage = ex?.InnerException?.Message, Error = "Please, All fiels are required." });
                }
            }
            return StatusCode(500, new { success = false, Message = "An error ocurred", Error = "Please, All fiels are required." });
        }
    }
}
