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

        public async Task VideoNotification(string userId)
        {
            await Clients.All.SendAsync("videonotification");
        }

        public async Task SendOfferIceCandidate(string candidate)
        {
            await Clients.All.SendAsync("offericecandidate", candidate);
        }

        public async Task SendAnswerIceCandidate(string candidate)
        {
            await Clients.All.SendAsync("answericecandidate", candidate);
        }
    }
}

