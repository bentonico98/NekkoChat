using NekkoChat.Server.Constants;

namespace NekkoChat.Server.Models
{
    public class ResponseDTO<T>
    {

        public bool Success { get; set; } = true;
        public List<T>? User { get; set; } = new List<T>();
        public T? SingleUser { get; set; }
        public string? Message { get; set; } = "Successful";
        public string? InternalMessage { get; set; } = "Unknown Error";
        public string? Error { get; set; } = ErrorMessages.Success;
        public int StatusCode { get; set; } = 200;
    }
}
