namespace NekkoChat.Server.Schemas
{
    public class GroupMemberSchema
    {
        public int id { get; set; }
        public int group_id { get; set; }
        public string? user_id { get; set; }
    }
}
