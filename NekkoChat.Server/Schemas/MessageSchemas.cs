namespace NekkoChat.Server.Schemas
{
    public class MessageSchemas
    {
        public int id { get; set; }
        public object[]? messages { get; set; }
        public object[]? participants { get; set; }
    }
}
