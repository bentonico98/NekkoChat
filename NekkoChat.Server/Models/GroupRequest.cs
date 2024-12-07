using NekkoChat.Server.Schemas;

namespace NekkoChat.Server.Models
{
    public class GroupRequest
    {
        public string value { get; set; } = string.Empty;
        public string user_id { get; set; } = string.Empty;
        public string sender_id { get; set; } = string.Empty;
        public int group_id { get; set; }
        public string groupname { get; set; } = string.Empty;
        public string grouptype { get; set; } = string.Empty;
        public string groupdesc { get; set; } = string.Empty;
        public string groupphoto { get; set; } = string.Empty;
        public ParticipantsSchema[] participants { get; set; } = new ParticipantsSchema[0];

    }
}
