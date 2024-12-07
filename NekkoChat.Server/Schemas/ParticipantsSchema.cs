namespace NekkoChat.Server.Schemas
{
    public class ParticipantsSchema
    {
        public string id { get; set; }  = string.Empty; 
        public string name { get; set; } = string.Empty;
        public string profilePic { get; set; } = "/src/assets/avatar.png";
        public string connectionid { get; set; } = string.Empty;
    }
}
