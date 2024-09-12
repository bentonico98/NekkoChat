namespace NekkoChat.Server.Schemas
{
    public class SingleChatSchemas
    {

        public string? id { get; set; }
        public string? text { get; set; }

        public string? user { get; set; }

        public DateTime timestamp { get; set; } = DateTime.Now;

    }
}
