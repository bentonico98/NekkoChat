using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NekkoChat.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class LoginController(SignInManager<AspNetUsers> signInManager, UserManager<AspNetUsers> userManager) : ControllerBase
    {
        private readonly SignInManager<AspNetUsers> _signInManager = signInManager;
        private readonly UserManager<AspNetUsers> _userManager = userManager;

        // POST /login
        [HttpPost("/login")]
        public async Task<IActionResult> Login([FromBody] LoginSchemas data)
        {
            if (ModelState.IsValid)
            {
                AspNetUsers user = await _userManager.FindByEmailAsync(data.username);
                try
                {
                    var result = await _signInManager.PasswordSignInAsync(user, data!.password, isPersistent: true, lockoutOnFailure: false);
                    if (result.Succeeded)
                    {
                        object payload = new { success = true, user = user };
                        return Ok(payload);
                    }
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new { success = false, Message = ex.Message, Error = "Please, All fiels are required." });
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
                AspNetUsers user = new AspNetUsers { Email = data.email, UserName = data.username, EmailConfirmed = true, PhoneNumber = data.phoneNumber, PhoneNumberConfirmed = true };
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
        [HttpPost("/logout")]
        public void Delete(int id)
        {
        }
    }
}
