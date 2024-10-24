namespace NekkoChat.Server.Models
{
    public class ResponseDTO<T>
    {

        public bool Success { get; set; }
        public List<T>? User { get; set; } = new List<T>();

        public string? Message { get; set; }

        public string? Error { get; set; }

        public int StatusCode { get; set; } = 200;
    }
}
