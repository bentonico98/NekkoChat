using NekkoChat.Server.Constants.Types;

namespace NekkoChat.Server.Models
{
    public class Users
    {
        public int id { get; set; }
        public string? username { get; set; }
        public string? email { get; set; }
        public string? password { get; set; }
        public ValidStatus.Valid_Status? status { get; set; } = 0;
        public string? about { get; set; }
        public string? profilePhotoUrl { get; set; }
        public string? connectionId { get; set; }
        public int? friends_Count { get; set; }
    }
}
