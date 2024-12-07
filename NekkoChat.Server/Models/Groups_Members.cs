using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace NekkoChat.Server.Models
{
    public class Groups_Members
    {
        [Key]
        public int id { get; set; }
        public int group_id { get; set; }
        public string? user_id { get; set; }

    }
}
