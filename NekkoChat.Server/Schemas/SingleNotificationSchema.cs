using NekkoChat.Server.Constants.Types;

namespace NekkoChat.Server.Schemas
{
    public class SingleNotificationSchema
    {
        public string id { get; set; } = string.Empty;
        public ValidStatus.Valid_Notifications? type { get; set; } = (ValidStatus.Valid_Notifications)0;
        public bool seen { get; set; } = false;
        public string url { get; set; } = "/inbox";
        public string from { get; set; } = "unknown";
        public string from_id { get; set; } = string.Empty;
        public string operation { get; set; } = string.Empty;
        public DateTime date { get; set; } = DateTime.Now;

    }
}
