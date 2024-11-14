﻿namespace NekkoChat.Server.Schemas
{
    public class SingleChatSchemas
    {

        public string id { get; set; } = string.Empty;
        public string content { get; set; } = string.Empty;
        public string user_id { get; set; } = string.Empty; 
        public string username { get; set; } = string.Empty;
        public string created_at { get; set; } = DateTime.Now.ToString("yyyy-mm-dd HH:mm:ss");
        public bool read { get; set; } = false;

    }
}
