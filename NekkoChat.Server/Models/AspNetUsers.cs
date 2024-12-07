using Microsoft.AspNetCore.Identity;
using NekkoChat.Server.Constants.Types;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace NekkoChat.Server.Models
{
    public class AspNetUsers : IdentityUser
    {
        public ValidStatus.Valid_Status? Status { get; set; } = 0;
        public string? About { get; set; }
        public string? ProfilePhotoUrl { get; set; }
        public string? ConnectionId { get; set; }
        public int? Friends_Count { get; set; }
        public string? LastOnline { get; set; }
        public string? Fname { get; set; }
        public string? Lname { get; set; }
        public string? FullName { get; set; }
    }
}
