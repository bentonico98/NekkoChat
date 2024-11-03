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
            AspNetUsers sender = await _context.AspNetUsers.FindAsync(sender_id);
            AspNetUsers receiver = await _context.AspNetUsers.FindAsync(receiver_id);

            string senderconnectionid = "";
            string receiverconnectionid = "";

            if (sender != null)
            {
                senderconnectionid = sender!.ConnectionId;
            }
            if (receiver != null)
            {
                receiverconnectionid = receiver!.ConnectionId;
            }

            return Clients.Clients(receiverconnectionid).SendAsync("ReceiveTypingSignal", sender?.Id);
        }
        public async Task<Task> SendMessage(string sender_id, string receiver_id, string msj)
        {
            AspNetUsers sender = await _context.AspNetUsers.FindAsync(sender_id);
            AspNetUsers receiver = await _context.AspNetUsers.FindAsync(receiver_id);

            string senderconnectionid = "";
            string receiverconnectionid = "";

            if (sender != null)
            {
                senderconnectionid = sender!.ConnectionId;
            }

            if (receiver != null)
            {
                receiverconnectionid = receiver!.ConnectionId;
            }

            return Clients.Clients(receiverconnectionid, senderconnectionid).SendAsync("ReceiveSpecificMessage", sender_id, msj);
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
