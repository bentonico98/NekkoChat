using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NekkoChat.Server.Models
{
    public class Chats
    {
        [Key]
        public int id { get; set; }

        [ForeignKey(nameof(NekkoChat.Server.Models.AspNetUsers.id)), Required]
        public int sender_id { get; set; }

        [ForeignKey(nameof(NekkoChat.Server.Models.AspNetUsers.id)), Required]
        public int receiver_id { get; set; }

        public string? type { get; set; }

        public bool? isArchived { get; set; } = false;

        public bool? isFavorite { get; set; } = false;
    }
}
