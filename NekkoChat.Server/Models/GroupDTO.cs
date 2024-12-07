using NekkoChat.Server.Schemas;
using System.ComponentModel.DataAnnotations;

namespace NekkoChat.Server.Models
{
    public class GroupDTO
    {
        public int id { get; set; }
        public string name { get; set; } = string.Empty;
        public string type { get; set; } = string.Empty;
        public string? description { get; set; }
        public string? profilePhotoUrl { get; set; }
        public ParticipantsSchema[]? participants { get; set; } = new ParticipantsSchema[0];
    }
}
