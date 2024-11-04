using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;

namespace NekkoChat.Server.Constants.Interfaces
{
    public interface iMessageService
    {
        public Task<bool> sendMessage(int chat_id, ChatRequest data);
        public bool readMessage(int chat_id, string sender_id);
        public Task<int> createChat(ChatRequest data);
        public bool favoriteMessage(int chat_id, ChatRequest data);
        public bool archiveMessage(int chat_id, ChatRequest data);
        public bool deleteMessage(int chat_id, ChatRequest data);
        public bool deleteChat(int arg1, string arg2);
    }
}
