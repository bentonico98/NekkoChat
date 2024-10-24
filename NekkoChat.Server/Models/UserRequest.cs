namespace NekkoChat.Server.Models
{
    public class UserRequest
    {
        public string? sender_id { get; set; }
        public string? receiver_id { get; set; }
        public string? user_id { get; set; }
        public string? operation { get; set; }
        public string? status { get; set; }
    }
}
