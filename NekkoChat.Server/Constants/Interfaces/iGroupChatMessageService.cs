using NekkoChat.Server.Models;
using NekkoChat.Server.Schemas;

namespace NekkoChat.Server.Constants.Interfaces
{
    public interface iGroupChatMessageService
    {
        public Task<bool> sendMessage(GroupRequest data);
        public bool readMessage(GroupRequest data, int group_id);
        public Task<bool> addParticipantToGroup(GroupRequest data, int group_id);
        public Task<int> createChat(GroupRequest data);
        public bool favoriteMessage();
        public bool archiveMessage();
        public bool deleteMessage();
        public bool deleteChat();
    }
}
