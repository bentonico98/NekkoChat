using Microsoft.EntityFrameworkCore;
using NekkoChat.Server.Constants.Interfaces;
using NekkoChat.Server.Constants.Types;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace NekkoChat.Server.Utils
{
    public class NotificationService(IServiceProvider srv) : iNotificationService
    {
        public bool CreateNotification(NotificationRequest data)
        {
            using (var ctx = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                AspNetUsers sender = ctx.AspNetUsers.Find(data.from_id);

                SingleNotificationSchema[] notifications = [new SingleNotificationSchema
                {
                    id = Guid.NewGuid().ToString(),
                    seen = false,
                    type = (ValidStatus.Valid_Notifications)data.type,
                    from = $"{sender!.Fname}{sender!.Lname}",
                    from_id = data.from_id,
                    operation =  data.operation,
                    url = data.url
                }];

                Notifications newNotification = new Notifications
                {
                    User_Id = data.user_id,
                    Notification = JBProcessor.NotificationProcessed(notifications)
                };

                ctx.notifications.AddAsync(newNotification);
                ctx.SaveChangesAsync();
            }
            return true;
        }
        public bool ReadNotification(NotificationRequest data)
        {
            using (var ctx = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                Notifications notifications = ctx.notifications.Where((n) => n.User_Id == data.user_id).FirstOrDefault();

                if(notifications is null) return false;

                List<SingleNotificationSchema> filteredNotification = new();

                foreach (var notification in notifications.Notification)
                {
                    var output = JsonSerializer.Deserialize<SingleNotificationSchema>(notification);
                    filteredNotification.Add(output);
                }

                foreach (var item in filteredNotification)
                {
                    if(item.id == data.notification_id)
                    {
                        item.seen = true;
                    }
                }
                notifications.Notification = JBProcessor.NotificationProcessed(filteredNotification);
                
                ctx.notifications.Update(notifications);
                ctx.SaveChangesAsync();
            }
            return true;
        }
        public bool DeleteNotification(NotificationRequest data)
        {
            using (var ctx = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                Notifications notifications = ctx.notifications.Where((n) => n.User_Id == data.user_id).FirstOrDefault();

                if (notifications is null) return false;

                List<SingleNotificationSchema> filteredNotification = new();

                foreach (var notification in notifications.Notification)
                {
                    var output = JsonSerializer.Deserialize<SingleNotificationSchema>(notification);
                    filteredNotification.Add(output);
                }

                List<SingleNotificationSchema> newNotifications = new();

                foreach (var item in filteredNotification)
                {
                    if (item.id != data.notification_id)
                    {
                        newNotifications.Add(item);
                    }
                }

                notifications.Notification = JBProcessor.NotificationProcessed(newNotifications);
                
                ctx.notifications.Update(notifications);
                ctx.SaveChangesAsync();
            }
            return true;
        }
    }
}
