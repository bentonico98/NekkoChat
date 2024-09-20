import MessageSchema from "../Schemas/MessageSchema"
 class ServerLinks {
     private static ServerUrl = "https://localhost:7198/"

     public static getCreateChatUrl(message: MessageSchema) {
         const url = `chats/chat/create/${message.chat_id}?value=${message.content}&sender_id=${message.sender_id}&receiver_id=${message.receiver_id}`
         return `${this.ServerUrl}${url}`;
     };
     public static getSendMessageUrl(message: MessageSchema) {
         const url = `chats/chat/send/${message.chat_id}?value=${message.content}&sender_id=${message.sender_id}&receiver_id=${message.receiver_id}`
        return `${this.ServerUrl}${url}`;
     };
     public static getAllUsersChatUrl(id:any) {
         const url = `chats/chats/${id}`
         return `${this.ServerUrl}${url}`;
     };
     public static getOneUsersChatUrl(id: any) {
         const url = `chats/chat/${id}`
         return `${this.ServerUrl}${url}`;
     };
}

export default ServerLinks;