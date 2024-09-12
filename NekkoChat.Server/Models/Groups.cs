using System.ComponentModel.DataAnnotations;

namespace NekkoChat.Server.Models
{
    public class Groups
    {
        [Key]
        public int id { get; set; }
        [Required]
        public string? name { get; set; }
        [Required]
        public string? type { get; set; }
        public string? description { get; set; } = null;
        public string? profilePhotoUrl { get; set; }

    }
}
