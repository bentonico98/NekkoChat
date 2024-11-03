using NekkoChat.Server.Models;

namespace NekkoChat.Server.Constants.Interfaces
{
    public interface iNotificationService
    {
        public  bool CreateNotification(NotificationRequest data);
        public  bool ReadNotification(NotificationRequest data);
        public  bool DeleteNotification(NotificationRequest data);
    }
}
