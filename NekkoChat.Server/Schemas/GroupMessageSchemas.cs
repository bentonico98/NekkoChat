namespace NekkoChat.Server.Schemas
{
    public class GroupMessageSchemas
    {
        public int id { get; set; }
        public GroupChatSchemas[]? messages { get; set; }
        public ParticipantsSchema[]? participants { get; set; }
    }
}
