using Microsoft.EntityFrameworkCore;
using NekkoChat.Server.Constants.Interfaces;
using NekkoChat.Server.Data;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace NekkoChat.Server.Utils
{
    public class VideocallServices
    {
        private readonly ApplicationDbContext _context;

        public VideocallServices(ApplicationDbContext context)
        {
            _context = context;
        }

        public class VideocallSenderUsers : IVideocallSenderUsers
        {
            public string Id { get; set; } = string.Empty;
            public string ProfilePhotoUrl { get; set; } = string.Empty;
            public string UserName { get; set; } = string.Empty;
        }

        public async Task<List<VideocallSenderUsers>> GetFriendsAsync(string userId)
        {
            var query = VideocallSenderUsersQuery(userId);
            return await query;
        }

        private async Task<List<VideocallSenderUsers>> VideocallSenderUsersQuery(string user_id)
        {
            var query = await _context.AspNetUsers
                .Join(_context.friend_list, u => u.Id, f => f.sender_id, (u, f) => new { u, f })
                .Union(_context.AspNetUsers
                    .Join(_context.friend_list, u => u.Id, f => f.receiver_id, (u, f) => new { u, f }))
                .Where(x => (x.f.sender_id == user_id || x.f.receiver_id == user_id) && x.u.Id != user_id && x.f.isAccepted == true)
                .Select(x => new VideocallSenderUsers
                {
                    Id = x.u.Id,
                    ProfilePhotoUrl = x.u.ProfilePhotoUrl!,
                    UserName = x.u.UserName!
                })
                .ToListAsync();

            return query; 
        }
    }
}