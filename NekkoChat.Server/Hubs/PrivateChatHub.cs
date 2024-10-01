using Microsoft.AspNetCore.SignalR;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using System.Security.Claims;
using NekkoChat.Server.Constants.Interfaces;
namespace NekkoChat.Server.Hubs
{
    public class PrivateChatHub(ApplicationDbContext context): Hub, iCustomChatHubs
    {
        private readonly ApplicationDbContext _context = context;
        public Task SendTypingSignal(string sender_id, string receiver_id)
        {
            AspNetUsers sender = _context.AspNetUsers.Find(sender_id);
            AspNetUsers receiver = _context.AspNetUsers.Find(receiver_id);

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
        public Task SendMessageToUser(string sender_id, string receiver_id, string msj)
        {
            AspNetUsers sender = _context.AspNetUsers.Find(sender_id);
            AspNetUsers receiver = _context.AspNetUsers.Find(receiver_id);

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
    }
}
