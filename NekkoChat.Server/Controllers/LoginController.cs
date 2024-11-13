using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NekkoChat.Server.Constants;
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
    public class LoginController(
        SignInManager<AspNetUsers> signInManager,
        UserManager<AspNetUsers> userManager,
        ApplicationDbContext context,
        IMapper mapper,
        ILogger<LoginController> logger) : ControllerBase
    {
        private readonly SignInManager<AspNetUsers> _signInManager = signInManager;
        private readonly UserManager<AspNetUsers> _userManager = userManager;
        private readonly ApplicationDbContext _context = context;
        private readonly IMapper _mapper = mapper;
        private readonly ILogger<LoginController> _logger = logger;

        // POST /login
        [HttpPost("/login")]
        public async Task<IActionResult> Login([FromBody] LoginSchemas data)
        {
            if (ModelState.IsValid)
            {
                AspNetUsers user = await _userManager.FindByEmailAsync(data.email);
                try
                {
                    var date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");
                    user!.LastOnline = date;
                    user!.Status = ValidStatus.Valid_Status.available;

                    var result = await _signInManager.PasswordSignInAsync(
                        user,
                        data!.password,
                        isPersistent: true,
                        lockoutOnFailure: false);

                    if (result.Succeeded)
                    {
                        _context.AspNetUsers.Update(user);
                        _context.SaveChanges();
                        UserDTO userView = _mapper.Map<UserDTO>(user);
                        return Ok(new ResponseDTO<UserDTO> { SingleUser = userView });
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message + " In Login Route");
                    if (ex.InnerException is not null)
                    {
                        _logger.LogError(ex?.InnerException?.Message + " In Notification - Get Route");
                    }
                    return StatusCode(500, new ResponseDTO<UserDTO> { Success = false, Message = ErrorMessages.ErrorMessage, InternalMessage = ErrorMessages.ErrorMessage, Error = ErrorMessages.WrongCredentials });
                }
            }
            _logger.LogWarning(ErrorMessages.MissingValues + " In Login Route");
            return StatusCode(500, new ResponseDTO<UserDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.WrongCredentials });
        }

        // POST /login
        [HttpPost("/register")]
        public async Task<IActionResult> Register([FromBody] RegisterSchemas data)
        {
            if (ModelState.IsValid)
            {
                try
                {
                    if (data.password.Equals(data.confirmPassword))
                    {
                        var date = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss");

                        AspNetUsers user = new AspNetUsers
                        {
                            Email = data.email,
                            UserName = data.fname,
                            Fname = data.fname,
                            Lname = data.lname,
                            FullName = $"{data.fname} {data.lname}",
                            EmailConfirmed = true,
                            PhoneNumber = data.phoneNumber,
                            PhoneNumberConfirmed = true,
                            LastOnline = date,
                            Status = ValidStatus.Valid_Status.available,
                            TwoFactorEnabled = false,
                            LockoutEnabled = false,
                            Friends_Count = 0,
                            About = !string.IsNullOrEmpty(data.about) ? data.about : "Available",
                            ProfilePhotoUrl = !string.IsNullOrEmpty(data.profilePhotoUrl) ? data.profilePhotoUrl : "/src/assets/avatar.png"

                        };

                        var userCreated = await _userManager.CreateAsync(user, data.password);

                        if (userCreated.Succeeded)
                        {
                            await _signInManager.SignInAsync(
                                user,
                                isPersistent: false);

                            UserDTO userView = _mapper.Map<UserDTO>(user);

                            return Ok(new ResponseDTO<UserDTO> { SingleUser = userView });
                        }
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message + " In Register Route");
                    if (ex.InnerException is not null)
                    {
                        _logger.LogError(ex?.InnerException?.Message + " In Notification - Get Route");
                    }
                    return StatusCode(500, new ResponseDTO<UserDTO> { Success = false, Message = ErrorMessages.ErrorMessage, InternalMessage = ErrorMessages.ErrorMessage, Error = ErrorMessages.WrongCredentials });
                }

            }
            _logger.LogWarning(ErrorMessages.MissingValues + " In Register Route");
            return StatusCode(500, new ResponseDTO<UserDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.MissingValues });
        }

        // DELETE /logout/5
        [HttpPut("/logout")]
        public async Task<IActionResult> Logout([FromBody] UserRequest data)
        {
            if (ModelState.IsValid)
            {
                AspNetUsers user = await _userManager.FindByIdAsync(data.user_id);
                try
                {
                    user!.Status = ValidStatus.Valid_Status.unavailable;

                    await _signInManager.SignOutAsync();

                    _context.AspNetUsers.Update(user);
                    await _context.SaveChangesAsync();

                    UserDTO userView = _mapper.Map<UserDTO>(user);
                    return Ok(new ResponseDTO<UserDTO>());
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex.Message + " In Logout Route");
                    if (ex.InnerException is not null)
                    {
                        _logger.LogError(ex?.InnerException?.Message + " In Notification - Get Route");
                    }
                    return StatusCode(500, new ResponseDTO<UserDTO> { Success = false, Message = ErrorMessages.ErrorMessage, InternalMessage = ErrorMessages.ErrorMessage, Error = ErrorMessages.MissingValues });
                }
            }
            _logger.LogWarning(ErrorMessages.MissingValues + " In Logout Route");
            return StatusCode(500, new ResponseDTO<UserDTO> { Success = false, Message = ErrorMessages.ErrorRegular, InternalMessage = ErrorMessages.ErrorMessage, Error = ErrorMessages.MissingValues });
        }
    }
}
