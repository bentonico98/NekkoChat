using Microsoft.AspNetCore.Identity;
using NekkoChat.Server.Constants.Types;
using System.ComponentModel.DataAnnotations;
namespace NekkoChat.Server.Models
{
    public class AspNetUsers : IdentityUser
    {
        [Key]
        public new int id { get; set; }
        public ValidStatus.Valid_Status? status { get; set; } = 0;
        public string? about { get; set; }

        public string? profilePhotoUrl { get; set; }

        public int? friends_Count { get; set; }  
    }
}
