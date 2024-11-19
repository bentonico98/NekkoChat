namespace NekkoChat.Server.Constants.Interfaces
{
    public interface iFriendRequestService
    {
        public Task<bool> IncreaseFriendCount(string user_id);
        public Task<bool> DecreaseFriendCount(string user_id);
    }
}
