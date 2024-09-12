using Microsoft.AspNetCore.SignalR;

namespace NekkoChat.Server.Hubs
{
    public class PrivateChatHub: Hub
    {
        public Task SendMessage(string username, string msj)
        {
            return Clients.All.SendAsync("ReceiveMessage", username, msj);    
        }
    }
}
