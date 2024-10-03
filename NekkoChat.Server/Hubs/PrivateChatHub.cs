using Microsoft.AspNetCore.SignalR;

namespace NekkoChat.Server.Hubs
{
    public class PrivateChatHub: Hub
    {
        public Task SendMessage(string username, string msj)
        {
            return Clients.All.SendAsync("ReceiveMessage", username, msj);    
        }

        public async Task Offer(string sdp)
        {
            await Clients.All.SendAsync("offer", sdp);
        }

        public async Task Answer(string sdp)
        {
            await Clients.All.SendAsync("answer", sdp);
        }

       
    }
}

