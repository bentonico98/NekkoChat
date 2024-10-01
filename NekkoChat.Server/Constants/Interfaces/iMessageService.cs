using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;

namespace NekkoChat.Server.Constants.Interfaces
{
    public interface iMessageService
    {
        public Task<bool> sendMessage(int chat_id, string sender_id, string receiver_id, string msj);
        public Task<int> createChat(string sender_id, string receiver_id, string msj);
        public bool readMessage(int chat_id, string sender_id);
        public void favoriteMessage();
        public void archiveMessage();
        public void deleteMessage();
        public void deleteChat();
    }
}
