using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Nodes;

namespace NekkoChat.Server.Models
{
    public class Users_Messages
    {
        [Key]
        public int id { get; set; }

        [ForeignKey(nameof(NekkoChat.Server.Models.Chats.id)), Required]
        public int chat_id { get; set; }

        [Column(TypeName = "jsonb")]
        public string? content { get; set; }
    }
}
