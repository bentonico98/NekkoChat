using NekkoChat.Server.Constants.Types;

namespace NekkoChat.Server.Models
{
    public class NotificationRequest
    {
        public string user_id { get; set; } = string.Empty;
        public string id { get; set; } = string.Empty;
        public string operation { get; set; } = string.Empty;
        public ValidStatus.Valid_Notifications type { get; set; } = ValidStatus.Valid_Notifications.regular;
        public string from { get; set; } = string.Empty;
        public string from_id { get; set; } = string.Empty;
        public string url { get; set; } = string.Empty;
    }
}
