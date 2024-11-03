using Microsoft.EntityFrameworkCore;
using NekkoChat.Server.Constants.Interfaces;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;

namespace NekkoChat.Server.Utils
{
    public class FriendRequestService() : iFriendRequestService
    {
        public async Task<bool> IncreaseFriendCount(string user_id, IServiceProvider srv)
        {
            bool success = await IncreaseInvoke(user_id, srv);
            return success;
        }
        public async Task<bool> DecreaseFriendCount(string user_id, IServiceProvider srv)
        {
            bool success = await DecreaseInvoke(user_id, srv);
            return success;
        }

        private static async Task<bool> IncreaseInvoke(string user_id, IServiceProvider srv)
        {
            using (var ctx = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                AspNetUsers user = await ctx.AspNetUsers.FindAsync(user_id);

                if (user.Friends_Count <= 200)
                {
                    user.Friends_Count++;
                    ctx.AspNetUsers.Update(user);
                    await ctx.SaveChangesAsync();
                    return true;
                }
            }
            return false;
        }
        private static async Task<bool> DecreaseInvoke(string user_id, IServiceProvider srv)
        {
            using (var ctx = new ApplicationDbContext(srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                AspNetUsers user = await ctx.AspNetUsers.FindAsync(user_id);

                if (user.Friends_Count > 0)
                {
                    user.Friends_Count--;
                    ctx.AspNetUsers.Update(user);
                    await ctx.SaveChangesAsync();
                    return true;
                }
            }
            return false;
        }
    }
}
