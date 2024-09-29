using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NekkoChat.Server.Models
{
    public class Chats
    {
        [Key]
        public int id { get; set; }

        [ForeignKey(nameof(NekkoChat.Server.Models.AspNetUsers.Id)), Required]
        public string? sender_id { get; set; }

        [ForeignKey(nameof(NekkoChat.Server.Models.AspNetUsers.Id)), Required]
        public string? receiver_id { get; set; }

        public string? type { get; set; }

        public bool? isArchived { get; set; } = false;

        public bool? isFavorite { get; set; } = false;
    }
}
