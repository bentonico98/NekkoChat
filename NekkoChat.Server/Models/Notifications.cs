using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NekkoChat.Server.Models
{
    public class Notifications
    {
        [Key]
        public int Id { get; set; }
        public string? User_Id { get; set; }

        [Column(TypeName = "jsonb")]
        public string? Notification { get; set; }
    }
}
