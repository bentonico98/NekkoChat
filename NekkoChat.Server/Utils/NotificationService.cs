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
        public async Task<bool> CreateNotification(NotificationRequest data)
        {
            if (data is null || string.IsNullOrEmpty(data.from_id) || string.IsNullOrEmpty(data.user_id)) return false;

            using (var ctx = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                AspNetUsers sender = await ctx.AspNetUsers.FindAsync(data.from_id);

                if (sender is null) return false;

                bool hasNotification = await ctx.notifications.AnyAsync((n) => n.User_Id == data.user_id);

                if (hasNotification)
                {
                    IQueryable<Notifications> UserNotifications = ctx.notifications.Where((n) => n.User_Id == data.user_id);

                    if (!UserNotifications.Any() || UserNotifications is null) return false;
                    Notifications notification = UserNotifications.FirstOrDefault()!;

                    if (notification is null || notification.Notification is null) return false;
                    NotificationSchema notificationSchema = JsonSerializer.Deserialize<NotificationSchema>(notification.Notification)!;

                    SingleNotificationSchema singleNotification = new SingleNotificationSchema
                    {
                        id = Guid.NewGuid().ToString(),
                        seen = false,
                        type = (ValidStatus.Valid_Notifications)data.type,
                        from = $"{sender!.Fname} {sender!.Lname}",
                        from_id = data.from_id,
                        operation = data.operation,
                        url = data.url,
                    };

                    if (notificationSchema is null || notificationSchema.notifications is null) return false;

                    SingleNotificationSchema[] allNotifications = notificationSchema.notifications;

                    if (allNotifications is null) return false;

                    List<SingleNotificationSchema> tempArray = allNotifications.ToList();
                    tempArray.Add(singleNotification);
                    allNotifications = tempArray.ToArray();

                    notification.Notification = JBProcessor.NotificationProcessed(allNotifications);

                    ctx.notifications.Update(notification);
                    await ctx.SaveChangesAsync();
                    return true;

                }

                SingleNotificationSchema[] notifications = [new SingleNotificationSchema
                {
                    id = Guid.NewGuid().ToString(),
                    seen = false,
                    type = (ValidStatus.Valid_Notifications)data.type,
                    from = $"{sender!.Fname} {sender!.Lname}",
                    from_id = data.from_id,
                    operation =  data.operation,
                    url = data.url
                }];

                Notifications newNotification = new Notifications
                {
                    User_Id = data.user_id,
                    Notification = JBProcessor.NotificationProcessed(notifications)
                };

                ctx.notifications.Add(newNotification);
                await ctx.SaveChangesAsync();
            }
            return true;
        }
        public async Task<bool> ReadNotification(NotificationRequest data)
        {
            using (var ctx = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                Notifications notifications = ctx.notifications.Where((n) => n.User_Id == data.user_id).FirstOrDefault()!;

                if (notifications is null || notifications.Notification is null) return false;

                List<SingleNotificationSchema> filteredNotification = new();
                NotificationSchema notificationSchema = JsonSerializer.Deserialize<NotificationSchema>(notifications.Notification)!;

                if (notificationSchema is null || notificationSchema.notifications is null) return false;
                foreach (var notification in notificationSchema.notifications)
                {
                    SingleNotificationSchema output = (notification);
                    filteredNotification.Add(output);
                }

                foreach (var item in filteredNotification)
                {
                    if (item.id == data.id)
                    {
                        item.seen = true;
                    }
                }
                notifications.Notification = JBProcessor.NotificationProcessed(filteredNotification);

                ctx.notifications.Update(notifications);
                await ctx.SaveChangesAsync();
            }
            return true;
        }
        public async Task<bool> DeleteNotification(NotificationRequest data)
        {
            using (var ctx = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                Notifications notifications = ctx.notifications.Where((n) => n.User_Id == data.user_id).FirstOrDefault()!;

                if (notifications is null || notifications.Notification is null) return false;

                List<SingleNotificationSchema> filteredNotification = new();

                NotificationSchema notificationSchema = JsonSerializer.Deserialize<NotificationSchema>(notifications.Notification)!;

                if (notificationSchema is null || notificationSchema.notifications is null) return false;
                foreach (var notification in notificationSchema.notifications)
                {
                    SingleNotificationSchema output = (notification);
                    filteredNotification.Add(output);
                }

                List<SingleNotificationSchema> newNotifications = new();

                foreach (var item in filteredNotification)
                {
                    if (item.id != data.id)
                    {
                        newNotifications.Add(item);
                    }
                }

                notifications.Notification = JBProcessor.NotificationProcessed(newNotifications);

                ctx.notifications.Update(notifications);
                await ctx.SaveChangesAsync();
            }
            return true;
        }
    }
}
