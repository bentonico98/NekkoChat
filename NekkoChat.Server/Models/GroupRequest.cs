using NekkoChat.Server.Schemas;

namespace NekkoChat.Server.Models
{
    public class GroupRequest
    {
        public string? value { get; set; }
        public string? user_id { get; set; }
        public string? sender_id { get; set; }
        public int group_id { get; set; }
        public string? groupname { get; set; }
        public string? grouptype { get; set; }
        public string? groupdesc { get; set; }
        public string? groupphoto { get; set; }
        public ParticipantsSchema[]? participants { get; set; }

    }
}
