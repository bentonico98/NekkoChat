namespace NekkoChat.Server.Models
{
    public class ChatRequest
    {

        public string? user_id { get; set; }
        public int chat_id { get; set; }
        public string? message_id { get; set; }
        public string? value { get; set; }
        public string? sender_id { get; set; }
        public string? receiver_id { get; set; }
        public string? operation { get; set; }
        public bool favorite { get; set; } = false;
        public bool archive { get; set; } = false;

    }
}
