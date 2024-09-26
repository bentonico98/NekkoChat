using Microsoft.AspNetCore.SignalR;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using System.Security.Claims;
namespace NekkoChat.Server.Hubs
{
    public class PrivateChatHub(ApplicationDbContext context): Hub
    {
        private readonly ApplicationDbContext _context = context;
        public Task SendMessage(string username, string msj)
        {
            return Clients.All.SendAsync("ReceiveMessage", username, msj);    
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
