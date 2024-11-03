using NekkoChat.Server.Constants.Types;

namespace NekkoChat.Server.Models
{
    public class NotificationRequest
    {
        public string? user_id { get; set; }
        public string? notification_id { get; set; }
        public string? operation { get; set; }
        public ValidStatus.Valid_Notifications type { get; set; } = ValidStatus.Valid_Notifications.regular;
        public string? from { get; set; }
        public string? from_id { get; set; }
        public string? url { get; set; }
    }
}
