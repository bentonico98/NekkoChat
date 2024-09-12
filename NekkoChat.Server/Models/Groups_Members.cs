using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NekkoChat.Server.Models
{
    public class Groups_Members
    {
        [Key]
        public int id { get; set; }

        [ForeignKey(nameof(NekkoChat.Server.Models.Groups.id)), Required]
        public int group_id { get; set; }

        [ForeignKey(nameof(NekkoChat.Server.Models.AspNetUsers.id)), Required]
        public int user_id { get; set; }

    }
}
