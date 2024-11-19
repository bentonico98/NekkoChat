using Microsoft.AspNet.Identity;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

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
       // public AspNetUsers[] AllUsers { get; set; } = [];
    }
}
