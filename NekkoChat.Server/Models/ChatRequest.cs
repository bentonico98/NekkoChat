namespace NekkoChat.Server.Models
{
    public class ChatRequest
    {

        public string user_id { get; set; } = string.Empty;
        public int chat_id { get; set; }
        public string message_id { get; set; } = string.Empty;
        public string value { get; set; } = string.Empty;
        public string sender_id { get; set; } = string.Empty;
        public string receiver_id { get; set; } = string.Empty;
        public string operation { get; set; } = string.Empty;
        public bool favorite { get; set; } = false;
        public bool archive { get; set; } = false;

    }
}
