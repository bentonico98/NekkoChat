using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;

namespace NekkoChat.Server.Constants.Interfaces
{
    public interface iMessageService
    {
        public Task<bool> sendMessage(int chat_id, string sender_id, string receiver_id, string msj);
        public bool favoriteMessage(int arg1, string arg2, bool arg3);
        public bool archiveMessage(int arg1, string arg2, bool arg3);
        public bool deleteMessage(int arg1, string arg2, string arg3);
        public bool deleteChat(int arg1, string arg2);
    }
}
