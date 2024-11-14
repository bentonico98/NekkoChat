namespace NekkoChat.Server.Schemas
{
    public class MessageSchemas
    {
        public int id { get; set; }
        public SingleChatSchemas[] messages { get; set; } = new SingleChatSchemas[0];
        public ParticipantsSchema[] participants { get; set; } = new ParticipantsSchema[0];
    }
}
