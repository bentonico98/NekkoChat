using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using NekkoChat.Server.Constants;
using NekkoChat.Server.Constants.Interfaces;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;
using System.Text;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace NekkoChat.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class NotificationsController(
        ApplicationDbContext context,
        iNotificationService notificationService,
        ILogger<NotificationsController> logger,
        IDistributedCache cache) : ControllerBase
    {
        private readonly ApplicationDbContext _context = context;
        private readonly iNotificationService _nSrv = notificationService;
        private readonly ILogger<NotificationsController> _logger = logger;
        private readonly IDistributedCache _cache = cache;

        // GET: <NotificationsController>
        [HttpGet]
        public async Task<IActionResult> Get([FromQuery] string user_id)
        {
            if (string.IsNullOrEmpty(user_id))
            {
                _logger.LogWarning("User Id is Null In Notification - Get Route");
                return NotFound(new ResponseDTO<MessagesDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
            }

            try
            {
                List<NotificationSchema> userNotifications = new();

                string cacheKey = user_id + "notifications";

                var cacheData = await _cache.GetAsync(cacheKey);

                if (cacheData is not null)
                {
                    var cacheDataString = Encoding.UTF8.GetString(cacheData);
                    userNotifications = JsonSerializer.Deserialize<List<NotificationSchema>>(cacheDataString)!;
                }
                else
                {
                    IQueryable<Notifications> notifications = _context.notifications.Where((n) => n.User_Id == user_id);

                    if (notifications is null || !notifications.Any()) return NotFound(new ResponseDTO<MessagesDTO> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.NoExist, StatusCode = 404 });
                    await Task.Run(() =>
                    {
                        foreach (var notification in notifications)
                        {
                            if (notification is not null && !string.IsNullOrEmpty(notification.Notification))
                            {
                                NotificationSchema output = JsonSerializer.Deserialize<NotificationSchema>(notification.Notification)!;
                                userNotifications.Add(output);
                            }
                        }
                    });

                    string cacheDataString = JsonSerializer.Serialize<List<NotificationSchema>>(userNotifications);

                    var dataToCache = Encoding.UTF8.GetBytes(cacheDataString);

                    DistributedCacheEntryOptions cacheOpts = new DistributedCacheEntryOptions()
                        .SetAbsoluteExpiration(DateTime.Now.AddMinutes(5))
                        .SetSlidingExpiration(TimeSpan.FromMinutes(2));

                    await _cache.SetAsync(cacheKey, dataToCache, cacheOpts);
                }

                return Ok(new ResponseDTO<SingleNotificationSchema> { User = userNotifications[0]!.notifications.OrderByDescending((n) => n.date).ToList() });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " In Notification - Get Route");
                if (ex.InnerException is not null)
                {
                    _logger.LogError(ex?.InnerException?.Message + " In Notification - Get Route");
                }
                return StatusCode(500, new ResponseDTO<SingleNotificationSchema> { Success = false, Message = ErrorMessages.ErrorMessage, InternalMessage = ErrorMessages.ErrorMessage, Error = ErrorMessages.WrongCredentials });
            }
        }

        // POST <NotificationsController>
        [HttpPost("create")]
        public async Task<IActionResult> Post([FromBody] NotificationRequest data)
        {
            bool isCreated = false;

            try
            {
                if (ModelState.IsValid)
                {
                    isCreated = await _nSrv.CreateNotification(data);
                }

                if (!isCreated)
                {
                    _logger.LogDebug("Operation Failed In Notification - Create Route");
                    return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
                }
                return Ok(new ResponseDTO<bool>());

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " In Notification - Create Route");
                if (ex.InnerException is not null)
                {
                    _logger.LogError(ex?.InnerException?.Message + " In Notification - Create Route");
                }
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }


        }

        // PUT <NotificationsController>/5
        [HttpPut("read")]
        public async Task<IActionResult> Put([FromBody] NotificationRequest data)
        {
            bool isCreated = await _nSrv.ReadNotification(data);
            try
            {

                if (ModelState.IsValid)
                {
                    isCreated = await _nSrv.ReadNotification(data);
                }

                if (!isCreated)
                {
                    _logger.LogDebug("Operation Failed In Notification - Read Route");
                    return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
                }

                return Ok(new ResponseDTO<bool>());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " In Notification - Read Route");
                if (ex.InnerException is not null)
                {
                    _logger.LogError(ex?.InnerException?.Message + " In Notification - Read Route");
                }
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });

            }
        }

        // DELETE api/<NotificationsController>/5
        [HttpDelete("delete")]
        public async Task<IActionResult> Delete([FromBody] NotificationRequest data)
        {
            bool isCreated = await _nSrv.DeleteNotification(data);

            try
            {
                if (ModelState.IsValid)
                {
                    isCreated = await _nSrv.DeleteNotification(data);
                }

                if (!isCreated)
                {
                    _logger.LogDebug("Operation Failed In Notification - Delete Route");
                    return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
                }

                return Ok(new ResponseDTO<bool>());

            }
            catch (Exception ex)
            {
                _logger.LogError(ex.Message + " In Notification - Delete Route");
                if (ex.InnerException is not null)
                {
                    _logger.LogError(ex?.InnerException?.Message + " In Notification - Delete Route");
                }
                return StatusCode(500, new ResponseDTO<Groups> { Success = false, Message = ErrorMessages.ErrorRegular, Error = ErrorMessages.Failed, StatusCode = 500 });
            }
        }
    }
}
