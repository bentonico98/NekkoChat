using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Nodes;

namespace NekkoChat.Server.Models
{
    public class Groups_Messages
    {
        [Key]
        public int id { get; set; }
        public int group_id { get; set; }

        [Column(TypeName = "jsonb")]
        public string? content { get; set; }
    }
}
