namespace NekkoChat.Server.Constants.Interfaces
{
    public interface iFriendRequestService
    {
        public Task<bool> IncreaseFriendCount(string user_id, IServiceProvider srv);
        public Task<bool> DecreaseFriendCount(string user_id, IServiceProvider srv);
    }
}
