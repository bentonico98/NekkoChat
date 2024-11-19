namespace NekkoChat.Server.Models
{
    public class UserEditableRequest
    {
        public string user_id { get; set; } = string.Empty;
        public string lname { get; set; } = string.Empty;
        public string fname { get; set; } = string.Empty;
        public string about { get; set; } = string.Empty;
    }
}
