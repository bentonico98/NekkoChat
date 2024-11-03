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

                return Ok(new ResponseDTO<SingleNotificationSchema> { User = userNotifications[0]!.notifications.ToList() });
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
        public IActionResult Post([FromBody] NotificationRequest data)
        {
            bool isCreated = _nSrv.CreateNotification(data);

            if (!isCreated)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }

            return Ok(new ResponseDTO<bool>());
        }

        // PUT <NotificationsController>/5
        [HttpPut("read/{id}")]
        public IActionResult Put([FromRoute] int id, [FromBody] NotificationRequest data)
        {
            bool isCreated = _nSrv.ReadNotification(data);

            if (!isCreated)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }

            return Ok(new ResponseDTO<bool>());
        }

        // DELETE api/<NotificationsController>/5
        [HttpDelete("delete/{id}")]
        public IActionResult Delete([FromRoute] int id, [FromBody] NotificationRequest data)
        {
            bool isCreated = _nSrv.DeleteNotification(data);

            if (!isCreated)
            {
                return StatusCode(500, new ResponseDTO<Groups> { Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }

            return Ok(new ResponseDTO<bool>());
        }
    }
}
