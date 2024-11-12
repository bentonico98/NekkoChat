using Microsoft.AspNetCore.SignalR;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using System.Security.Claims;
using NekkoChat.Server.Constants.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace NekkoChat.Server.Hubs
{
    public class GroupChatHub(ApplicationDbContext context, IServiceProvider serviceProvider) : Hub, iCustomChatHubs
    {
        private readonly ApplicationDbContext _context = context;
        public async Task<Task> SendTypingSignal(string sender_id, string group_id)
        {
            int groupID = Convert.ToInt32(group_id);

            AspNetUsers sender = await _context.AspNetUsers.FindAsync(sender_id);
            Groups group = await _context.groups.FindAsync(groupID);


            IQueryable<Groups_Members> filteredMembers = from m in _context.groups_members select m;
            filteredMembers = filteredMembers.Where((m) => m.group_id == groupID);

            List<string> connectionIds = new();

            foreach (var member in filteredMembers)
            {
                using (var context = new ApplicationDbContext(serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                {
                    connectionIds.Add(context.AspNetUsers.Find(member.user_id).ConnectionId);
                }
            }

            return Clients.Clients(connectionIds).SendAsync("ReceiveTypingSignal", sender?.Id, $"{sender?.Fname} {sender?.Lname}");
        }
        public async Task<Task> SendMessage(string sender_id, string group_id, string msj)
        {
            int groupID = Convert.ToInt32(group_id);

            AspNetUsers sender = await _context.AspNetUsers.FindAsync(sender_id);
            Groups group = await _context.groups.FindAsync(groupID);


            IQueryable<Groups_Members> filteredMembers = from m in _context.groups_members select m;
            filteredMembers = filteredMembers.Where((m) => m.group_id == groupID);

            List<string> connectionIds = new();

            foreach (var member in filteredMembers)
            {
                using (var context = new ApplicationDbContext(serviceProvider.GetRequiredService<DbContextOptions<ApplicationDbContext>>()))
                {
                    connectionIds.Add(context.AspNetUsers.Find(member.user_id).ConnectionId);
                };
            }

            return Clients.Clients(connectionIds).SendAsync("ReceiveSpecificMessage", sender_id, msj, $"{sender?.Fname} {sender?.Lname}");
        }
        public async Task<Task> SendNotificationToUser(NotificationRequest data)
        {
            string receiverConnectionId = "";

            AspNetUsers receiver = await _context.AspNetUsers.FindAsync(data.user_id);

            if (receiver != null)
            {
                receiverConnectionId = receiver.ConnectionId;
            }

            return Clients.Clients(receiverConnectionId).SendAsync("ReceiveNotification", data.user_id);
        }
    }
}
