using Microsoft.AspNetCore.SignalR;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using System.Security.Claims;
using NekkoChat.Server.Constants.Interfaces;
using System.Runtime.Intrinsics.Arm;
using System;

namespace NekkoChat.Server.Hubs
{
    public class VideoCallHub : Hub
    {
        private readonly ApplicationDbContext _context;

        public VideoCallHub(ApplicationDbContext context)
        {
            _context = context;
        }

        private async Task<(string senderConnectionId, string receiverConnectionId)> GetConnectionIdsAsync(string senderId, string receiverId)
        {
            var sender = await _context.AspNetUsers.FindAsync(senderId);
            var receiver = await _context.AspNetUsers.FindAsync(receiverId);

            string senderConnectionId = sender?.ConnectionId ?? string.Empty;
            string receiverConnectionId = receiver?.ConnectionId ?? string.Empty;

            return (senderConnectionId, receiverConnectionId);
        }

        public async Task Offer(string senderId, string receiverId, string sdp)
        {
            var (senderConnectionId, receiverConnectionId) = await GetConnectionIdsAsync(senderId, receiverId);
            await Clients.Clients(receiverConnectionId, senderConnectionId).SendAsync("offer", sdp);
        }

        public async Task Answer(string senderId, string receiverId, string sdp)
        {
            var (senderConnectionId, receiverConnectionId) = await GetConnectionIdsAsync(senderId, receiverId);
            await Clients.Clients(receiverConnectionId, senderConnectionId).SendAsync("answer", sdp);
        }

        public async Task VideoNotification(string senderId, string receiverId, string data)
        {
            var (senderConnectionId, receiverConnectionId) = await GetConnectionIdsAsync(senderId, receiverId);
            await Clients.Clients(receiverConnectionId, senderConnectionId).SendAsync("videonotification", senderId, receiverId, data);
        }

        public async Task OfferVideoNotification(string senderId, string receiverId, bool isAccepted)
        {
            var (senderConnectionId, receiverConnectionId) = await GetConnectionIdsAsync(senderId, receiverId);
            await Clients.Clients(receiverConnectionId, senderConnectionId).SendAsync("offervideonotification", senderId, receiverId, isAccepted);
        }

        public async Task ConnectedVideoNotification(string senderId, string receiverId)
        {
            var (senderConnectionId, receiverConnectionId) = await GetConnectionIdsAsync(senderId, receiverId);
            await Clients.Clients(receiverConnectionId, senderConnectionId).SendAsync("connectedvideonotification", senderId, receiverId);
        }

        public async Task SendOfferIceCandidate(string senderId, string receiverId, string candidate)
        {
            var (senderConnectionId, receiverConnectionId) = await GetConnectionIdsAsync(senderId, receiverId);
            await Clients.Clients(receiverConnectionId, senderConnectionId).SendAsync("offericecandidate", candidate);
        }

        public async Task SendAnswerIceCandidate(string senderId, string receiverId, string candidate)
        {
            var (senderConnectionId, receiverConnectionId) = await GetConnectionIdsAsync(senderId, receiverId);
            await Clients.Clients(receiverConnectionId, senderConnectionId).SendAsync("answericecandidate", candidate);
        }

        public async Task SendRenegotiation(string senderId, string receiverId, string sdp)
        {
            var (senderConnectionId, receiverConnectionId) = await GetConnectionIdsAsync(senderId, receiverId);
            await Clients.Clients(receiverConnectionId, senderConnectionId).SendAsync("renegotiation", senderId, receiverId, sdp);
        }
        public async Task SendCallExit(string senderId, string receiverId)
        {
            var (senderConnectionId, receiverConnectionId) = await GetConnectionIdsAsync(senderId, receiverId);
            await Clients.Clients(receiverConnectionId, senderConnectionId).SendAsync("callexit");
        }
    }
}
