namespace NekkoChat.Server.Schemas
{
    public class SingleChatSchemas
    {

        public string? id { get; set; }
        public string? content { get; set; }

        public string? user_id { get; set; }
        public string? username { get; set; }

        public string created_at { get; set; } = DateTime.Now.ToString("yyyy-mm-dd HH:mm:ss");


    }
}
