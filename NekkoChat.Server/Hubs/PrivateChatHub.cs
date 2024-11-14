using Microsoft.AspNetCore.SignalR;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using System.Security.Claims;
using NekkoChat.Server.Constants.Interfaces;
using Microsoft.EntityFrameworkCore;
namespace NekkoChat.Server.Hubs
{
    public class PrivateChatHub(ApplicationDbContext context) : Hub, iCustomChatHubs
    {
        private readonly ApplicationDbContext _context = context;
        public async Task<Task> SendTypingSignal(string sender_id, string receiver_id)
        {
            if (string.IsNullOrEmpty(sender_id) ||
                string.IsNullOrEmpty(receiver_id)) return Task.FromResult(TypedResults.Unauthorized);

            AspNetUsers sender = await _context.AspNetUsers.FindAsync(sender_id);
            AspNetUsers receiver = await _context.AspNetUsers.FindAsync(receiver_id);

            string senderconnectionid = "";
            string receiverconnectionid = "";

            if (sender is not null && !string.IsNullOrEmpty(sender.ConnectionId))
            {
                senderconnectionid = sender!.ConnectionId;
            }
            if (receiver is not null && !string.IsNullOrEmpty(receiver.ConnectionId))
            {
                receiverconnectionid = receiver!.ConnectionId;
                return Clients.Clients(receiverconnectionid).SendAsync("ReceiveTypingSignal", sender?.Id);
            }

            return Task.FromResult(TypedResults.Unauthorized);
        }
        public async Task<Task> SendMessage(string sender_id, string receiver_id, string msj)
        {
            if (string.IsNullOrEmpty(sender_id) ||
                string.IsNullOrEmpty(receiver_id)) return Task.FromResult(TypedResults.Unauthorized);

            AspNetUsers sender = await _context.AspNetUsers.FindAsync(sender_id);
            AspNetUsers receiver = await _context.AspNetUsers.FindAsync(receiver_id);

            string senderconnectionid = "";
            string receiverconnectionid = "";

            if (sender is not null && !string.IsNullOrEmpty(sender.ConnectionId))
            {
                senderconnectionid = sender!.ConnectionId;
            }
            if (receiver is not null && !string.IsNullOrEmpty(receiver.ConnectionId))
            {
                receiverconnectionid = receiver!.ConnectionId;
                return Clients.Clients(receiverconnectionid, senderconnectionid).SendAsync("ReceiveSpecificMessage", sender_id, msj);
            }

            return Task.FromResult(TypedResults.Unauthorized);
        }

        public async Task<Task> SendNotificationToUser(NotificationRequest data)
        {
            string receiverConnectionId = "";

            if (!string.IsNullOrEmpty(data.user_id)) return Task.FromResult(TypedResults.Unauthorized);

            AspNetUsers receiver = await _context.AspNetUsers.FindAsync(data.user_id);

            if (receiver is not null && !string.IsNullOrEmpty(receiver.ConnectionId))
            {
                receiverConnectionId = receiver.ConnectionId;
                return Clients.Clients(receiverConnectionId).SendAsync("ReceiveNotification", data.user_id);

            }
            return Task.FromResult(TypedResults.Unauthorized);
        }
    }
}
