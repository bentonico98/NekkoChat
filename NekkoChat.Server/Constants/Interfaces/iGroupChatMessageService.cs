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
        public bool favoriteMessage(int group_id, ChatRequest data);
        public bool archiveMessage(int group_id, ChatRequest data);
        public bool deleteMessage(int group_id, ChatRequest data);
        public Task<bool> deleteChat(int group_id, string participant_id);
    }
}
