namespace NekkoChat.Server.Schemas
{
    public class GroupMessageSchemas
    {
        public int id { get; set; }
        public GroupChatSchemas[]? messages { get; set; }
        public object[]? participants { get; set; }
    }
}
