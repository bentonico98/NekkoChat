namespace NekkoChat.Server.Schemas
{
    public class RegisterSchemas
    {
        public string? username { get; set; }
        public string? email { get; set; }
        public string? fname { get; set; }
        public string? lname { get; set; }
        public string? password { get; set; }
        public string? confirmPassword { get; set; }
        public string? phoneNumber { get; set; }
        public string? about { get; set; } = "Available";
        public string? profilePhotoUrl { get; set; } = "/src/assets/avatar.png";
    }
}
