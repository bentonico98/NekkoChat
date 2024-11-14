using Microsoft.EntityFrameworkCore;
using NekkoChat.Server.Constants.Interfaces;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;

namespace NekkoChat.Server.Utils
{
    public class FriendRequestService(IServiceProvider srv) : iFriendRequestService
    {

        private readonly IServiceProvider _srv = srv;
        public async Task<bool> IncreaseFriendCount(string user_id)
        {
            if (string.IsNullOrEmpty(user_id)) return false;

            bool success = await IncreaseInvoke(user_id);
            return success;
        }
        public async Task<bool> DecreaseFriendCount(string user_id)
        {
            if (string.IsNullOrEmpty(user_id)) return false;

            bool success = await DecreaseInvoke(user_id);
            return success;
        }

        private async Task<bool> IncreaseInvoke(string user_id)
        {
            using (var ctx = new ApplicationDbContext(_srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                AspNetUsers user = await ctx.AspNetUsers.FindAsync(user_id);

                if(user is null) return false;

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
        private async Task<bool> DecreaseInvoke(string user_id)
        {
            using (var ctx = new ApplicationDbContext(_srv.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
            {
                AspNetUsers user = await ctx.AspNetUsers.FindAsync(user_id);

                if (user is null) return false;

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
