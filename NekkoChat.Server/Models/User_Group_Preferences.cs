using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NekkoChat.Server.Models
{
    public class User_Group_Preferences
    {
        [Key]

        public int id { get; set; }
        [ForeignKey(nameof(NekkoChat.Server.Models.Groups.id)), Required]
        public int group_id { get; set; }

        //// [ForeignKey(nameof(NekkoChat.Server.Models.AspNetUsers.Id)), Required]
        public string? user_id { get; set; }

        public bool? isArchived { get; set; } = false;

        public bool? isFavorite { get; set; } = false;
    }
}
