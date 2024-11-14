namespace NekkoChat.Server.Schemas
{
    public class GroupMessageSchemas
    {
        public string _id { get; set; } = string.Empty;
        public string groupname { get; set; } = string.Empty;
        public GroupChatSchemas[] messages { get; set; } = new GroupChatSchemas[0];
        public ParticipantsSchema[] participants { get; set; } = new ParticipantsSchema[0];
    }
}
