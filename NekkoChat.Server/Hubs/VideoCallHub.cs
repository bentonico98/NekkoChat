using Microsoft.AspNetCore.SignalR;
using NekkoChat.Server.Data;
using NekkoChat.Server.Models;
using System.Security.Claims;
using NekkoChat.Server.Constants.Interfaces;
using System.Runtime.Intrinsics.Arm;
using System;

namespace NekkoChat.Server.Hubs
{
    public class VideoCallHub(ApplicationDbContext context) : Hub
    {
        private readonly ApplicationDbContext _context = context;
        public async Task<Task> Offer(string sender_id, string receiver_id, string sdp)
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

            return Clients.Clients(receiverconnectionid, senderconnectionid).SendAsync("offer", sdp);
        }

        public async Task<Task> Answer(string sender_id, string receiver_id, string sdp)
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

            return Clients.Clients(receiverconnectionid, senderconnectionid).SendAsync("answer", sdp);
        }

        public async Task<Task> VideoNotification(string sender_id, string receiver_id)
        {
            AspNetUsers sender = await _context.AspNetUsers.FindAsync(sender_id);
            AspNetUsers receiver = await _context.AspNetUsers.FindAsync(receiver_id);

            Console.WriteLine(sender_id + " " + receiver_id);

            Console.WriteLine(sender + " " + receiver);

            string senderconnectionid = "";
            string receiverconnectionid = "";

            if (sender != null)
            {
                senderconnectionid = sender!.ConnectionId;
                Console.WriteLine($"senderconnectionid { senderconnectionid}");
            }

            if (receiver != null)
            {
                receiverconnectionid = receiver!.ConnectionId;
                Console.WriteLine($"receiverconnectionid {receiverconnectionid}");
            }

            return Clients.Clients(receiverconnectionid, senderconnectionid).SendAsync("videonotification", sender_id, receiver_id);
        }

        public async Task<Task> OfferVideoNotification(string sender_id, string receiver_id)
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

            return Clients.Clients(receiverconnectionid, senderconnectionid).SendAsync("OfferVideoNotification", sender_id, receiver_id);
        }

        public async Task<Task> ConnectedVideoNotification(string sender_id, string receiver_id)
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

            return Clients.Clients(receiverconnectionid, senderconnectionid).SendAsync("connectedvideonotification", sender_id, receiver_id);

        }

        public async Task<Task> SendOfferIceCandidate(string sender_id, string receiver_id, string candidate)
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

            return Clients.Clients(receiverconnectionid, senderconnectionid).SendAsync("offericecandidate", candidate);
        }

        public async Task<Task> SendAnswerIceCandidate(string sender_id, string receiver_id, string candidate)
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

            return Clients.Clients(receiverconnectionid, senderconnectionid).SendAsync("answericecandidate", candidate);
        }
    }
}

