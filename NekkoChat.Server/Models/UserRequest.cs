namespace NekkoChat.Server.Models
{
    public class UserRequest
    {
        public string sender_id { get; set; } = string.Empty;
        public string receiver_id { get; set; } = string.Empty;
        public string user_id { get; set; } = string.Empty;
        public string operation { get; set; } = string.Empty;
        public string status { get; set; } = string.Empty;
        public string connectionid { get; set; } = string.Empty;
    }
}
