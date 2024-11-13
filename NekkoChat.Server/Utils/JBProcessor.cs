using NekkoChat.Server.Schemas;
using System.Text.Json;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace NekkoChat.Server.Utils
{
    public class JBProcessor
    {
        public static string PrivateChatProcessed(int chat_id, SingleChatSchemas[] messages, ParticipantsSchema[] participants)
        {
            string content = "{" + $"\"_id\":\"{chat_id}\",\"messages\":{JsonSerializer.Serialize(messages)}, \"participants\":{JsonSerializer.Serialize(participants)}" + "}";
            return content;
        }
        public static string GroupChatProcessed(int chat_id, string groupname, GroupChatSchemas[] messages, ParticipantsSchema[] participants)
        {
            string content = "{" + $"\"_id\":\"{chat_id}\",\"messages\":{JsonSerializer.Serialize(messages)}, \"groupname\":\"{groupname}\", \"participants\":{JsonSerializer.Serialize(participants)}" + "}";
            return content;
        }
        public static string NotificationProcessed(IEnumerable<SingleNotificationSchema> notifications)
        {
            if(notifications.Count() < 0)
            {
                return "{" + $"\"notifications\":[]" + "}";
            }
            string content = "{" + $"\"notifications\":{JsonSerializer.Serialize(notifications)}" + "}";
            return content;
        }
    }
}
