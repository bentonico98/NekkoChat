namespace NekkoChat.Server.Schemas
{
    public class RegisterSchemas
    {
        public string username { get; set; } = string.Empty;
        public string email { get; set; } = string.Empty;
        public string fname { get; set; } = string.Empty;
        public string lname { get; set; } = string.Empty;
        public string password { get; set; } = string.Empty;
        public string confirmPassword { get; set; } = string.Empty;
        public string phoneNumber { get; set; } = string.Empty;
        public string about { get; set; } = "Available";
        public string profilePhotoUrl { get; set; } = "/src/assets/avatar.png";
    }
}
