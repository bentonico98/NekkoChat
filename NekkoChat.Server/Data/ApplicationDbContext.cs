using Microsoft.EntityFrameworkCore;
using NekkoChat.Server.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace NekkoChat.Server.Data
{
    public class ApplicationDbContext : IdentityDbContext<AspNetUsers>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) :
        base(options)
        { }
        public DbSet<NekkoChat.Server.Models.AspNetUsers> AspNetUsers { get; set; } = default!;
        public DbSet<NekkoChat.Server.Models.Users> users { get; set; } = default!;


        public DbSet<NekkoChat.Server.Models.Users_Messages> users_messages { get; set; } = default!;

        public DbSet<NekkoChat.Server.Models.User_Group_Preferences> user_group_preferencess { get; set; } = default!;

        public DbSet<NekkoChat.Server.Models.Chats> chats { get; set; } = default!;
        public DbSet<NekkoChat.Server.Models.Friend_List> friend_list { get; set; } = default!;

        public DbSet<NekkoChat.Server.Models.Groups> groups { get; set; } = default!;

        public DbSet<NekkoChat.Server.Models.Groups_Members> groups_members { get; set; } = default!;

        public DbSet<NekkoChat.Server.Models.Groups_Messages> groups_messages { get; set; } = default!;

        public DbSet<NekkoChat.Server.Models.Notifications> notifications { get; set; } = default!;
    }
}
