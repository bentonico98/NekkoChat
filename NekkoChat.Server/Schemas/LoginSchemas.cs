namespace NekkoChat.Server.Schemas
{
    public class LoginSchemas
    {
        public string email { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;

        public bool remember { get; set; } = false;
    }
}
