using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NekkoChat.Server.Models
{
    public class Friend_List
    {
        [Key]

        public int id { get; set; }

        [ForeignKey(nameof(NekkoChat.Server.Models.AspNetUsers.Id)), Required]
        public string? sender_id { get; set; }

        [ForeignKey(nameof(NekkoChat.Server.Models.AspNetUsers.Id)), Required]
        public string? receiver_id { get; set; }

        public bool? isAccepted { get; set; } = false;


    }
}
