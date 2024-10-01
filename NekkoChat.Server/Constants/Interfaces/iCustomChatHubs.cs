using Elastic.Clients.Elasticsearch.Nodes;
using NekkoChat.Server.Models;

namespace NekkoChat.Server.Constants.Interfaces
{
    public interface iCustomChatHubs
    {
        public Task SendTypingSignal(string sender_id, string receiver_id);
        public Task SendMessageToUser(string sender_id, string receiver_id, string msj);
    }
}
