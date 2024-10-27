using NekkoChat.Server.Constants.Types;

namespace NekkoChat.Server.Models
{
    public class UserDTO
    {
        public string? Id { get; set; }
        public string? UserName { get; set; }
        public string? ProfilePhotoUrl { get; set; }
        public int? Friends_Count { get; set; }
        public string? ConnectionId { get; set; }
        public string? About { get; set; }
        public string? LastOnline { get; set; }
        public bool isFriend { get; set; } = false;

        public bool isSender { get; set; } = false;
        public ValidStatus.Valid_Status? Status { get; set; } = (ValidStatus.Valid_Status)1;
    }
}
