namespace NekkoChat.Server.Schemas
{
    public class LoginSchemas
    {
        public string? email { get; set; }
        public string? password { get; set; }

        public bool? remember { get; set; } = false;
    }
}
