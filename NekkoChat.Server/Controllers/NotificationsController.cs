using Microsoft.AspNetCore.Mvc;
using NekkoChat.Server.Constants;
using NekkoChat.Server.Constants.Interfaces;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NekkoChat.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class NotificationsController(
        ApplicationDbContext context,
        iNotificationService notificationService) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;
        private readonly iNotificationService _nSrv = notificationService;

        // GET: <NotificationsController>
        [HttpGet]
        public IActionResult Get([FromQuery] string user_id)
        {
            try
            {
                List<NotificationSchema> userNotifications = new();
                List<SingleNotificationSchema> userViewNotifications = new();

                IQueryable<Notifications> notifications = _context.notifications.Where((n) => n.User_Id == user_id);

                foreach (var notification in notifications)
                {
                    NotificationSchema output = JsonSerializer.Deserialize<NotificationSchema>(notification.Notification);
                    userNotifications.Add(output);
                }

                return Ok(new ResponseDTO<SingleNotificationSchema> { User = userNotifications[0]!.notifications.OrderByDescending((n) => n.date).ToList() });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<SingleNotificationSchema> { Success = false, Message = ex.Message, InternalMessage = ex?.InnerException?.Message, Error = ErrorMessages.WrongCredentials });
            }
        }

        // GET <NotificationsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST <NotificationsController>
        [HttpPost("create")]
        public async Task<IActionResult> Post([FromBody] NotificationRequest data)
        {
            try
            {
                bool isCreated = await _nSrv.CreateNotification(data);

                if (!isCreated)
                {
                    return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
                }
                return Ok(new ResponseDTO<bool>());

            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }

        }

        // PUT <NotificationsController>/5
        [HttpPut("read")]
        public async Task<IActionResult> Put([FromBody] NotificationRequest data)
        {
            try
            {
                bool isCreated = await _nSrv.ReadNotification(data);

                if (!isCreated)
                {
                    return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
                }
                return Ok(new ResponseDTO<bool>());
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });

            }
        }

        // DELETE api/<NotificationsController>/5
        [HttpDelete("delete")]
        public async Task<IActionResult> Delete([FromBody] NotificationRequest data)
        {
            try
            {
                bool isCreated = await _nSrv.DeleteNotification(data);

                if (!isCreated)
                {
                    return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
                }
                return Ok(new ResponseDTO<bool>());

            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
        }
    }
}
