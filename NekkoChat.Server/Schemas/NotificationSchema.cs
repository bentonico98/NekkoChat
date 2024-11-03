using System.ComponentModel.DataAnnotations.Schema;

namespace NekkoChat.Server.Schemas
{
    public class NotificationSchema
    {
        public SingleNotificationSchema[]? notifications { get; set; }
    }
}
