using Microsoft.AspNetCore.Identity;
using NekkoChat.Server.Constants.Types;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace NekkoChat.Server.Models
{
    public class AspNetUsers : IdentityUser
    {
        /*[DatabaseGeneratedAttribute(DatabaseGeneratedOption.None)]
        public override string Id { get { return base.Id; } set { base.Id = value; } }

        [Key, DatabaseGeneratedAttribute(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }*/
        public ValidStatus.Valid_Status? Status { get; set; } = 0;
        public string? About { get; set; }

        public string? ProfilePhotoUrl { get; set; }

        public string? ConnectionId { get; set; }

        public int? Friends_Count { get; set; }  
    }
}
