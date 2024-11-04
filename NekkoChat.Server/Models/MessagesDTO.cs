using NekkoChat.Server.Constants.Types;
using NekkoChat.Server.Schemas;

namespace NekkoChat.Server.Models
{
    public class MessagesDTO
    {
        public string? _id { get; set; }
        public SingleChatSchemas[]? messages { get; set; }
        public ParticipantsSchema[]? participants { get; set; }
        public string? groupname { get; set; }
        public ValidStatus.Valid_Status? status { get; set; } = (ValidStatus.Valid_Status)1;
    }
}
