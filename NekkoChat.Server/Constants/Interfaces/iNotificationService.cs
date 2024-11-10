using NekkoChat.Server.Models;

namespace NekkoChat.Server.Constants.Interfaces
{
    public interface iNotificationService
    {
        public Task<bool> CreateNotification(NotificationRequest data);
        public Task<bool> ReadNotification(NotificationRequest data);
        public Task<bool> DeleteNotification(NotificationRequest data);
    }
}
