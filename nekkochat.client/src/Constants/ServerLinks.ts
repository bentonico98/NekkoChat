import GroupMessageSchema from "../Schemas/GroupMessageSchema";
import MessageSchema from "../Schemas/MessageSchema"
 class ServerLinks {
     private static ServerUrl = "https://localhost:7198/";

     ///////////////// PRIVATE CHATS URLS

     public static getCreateChatUrl(message: MessageSchema) {
         const url = `chats/chat/create/${message.chat_id}?value=${message.content}&sender_id=${message.sender_id}&receiver_id=${message.receiver_id}`
         return `${this.ServerUrl}${url}`;
     };
     public static getSendMessageUrl(message: MessageSchema) {
         const url = `chats/chat/send/${message.chat_id}?value=${message.content}&sender_id=${message.sender_id}&receiver_id=${message.receiver_id}`
        return `${this.ServerUrl}${url}`;
     };
     public static getAllUsersChatUrl(id:any) {
         const url = `chats/chats?id=${id}`
         return `${this.ServerUrl}${url}`;
     };
     public static getOneUsersChatUrl(id: any) {
         const url = `chats/chat/${id}`
         return `${this.ServerUrl}${url}`;
     };
     public static getReadMessageUrl(chat_id: string | undefined, sender_id: string) {
         const url = `chats/chat/read/${chat_id}?sender_id=${sender_id}`
         return `${this.ServerUrl}${url}`;
     }

     ///////// GROUP CHAT URLS

     public static getCreateGroupChatUrl(message: GroupMessageSchema) {
         //?sender_id=${sender_id}&=${groupname}&grouptype=${grouptype}&=${groupdesc}&=${groupphoto}&value=${value}
         const url = `group/chat/create/${message.group_id}?value=${message.content}&sender_id=${message.sender_id}&groupname=${message.groupname}&grouptype=${message.grouptype}&groupdesc=${message.groupdesc}&groupphoto=${message.groupphoto}`
         return `${this.ServerUrl}${url}`;
     };
     public static getSendMessageToGroupUrl(message: GroupMessageSchema) {
         const url = `group/chat/send/${message.group_id}?value=${message.content}&sender_id=${message.sender_id}&groupname=${message.groupname}&grouptype=${message.grouptype}&groupdesc=${message.groupdesc}&groupphoto=${message.groupphoto}`
         return `${this.ServerUrl}${url}`;
     };
     public static getAllGroupsChatUrl(id: any) {
         const url = `group/chats?user_id=${id}`
         return `${this.ServerUrl}${url}`;
     };
     public static getOneGroupChatUrl(id: any) {
         const url = `group/chat/${id}`
         return `${this.ServerUrl}${url}`;
     };
     public static getReadGroupMessageUrl(group_id: number | undefined, sender_id: string, groupname:string) {
         const url = `group/chat/read/${group_id}?sender_id=${sender_id}&groupname=${groupname}`
         return `${this.ServerUrl}${url}`;
     }
     public static getAddParticipantToGroupUrl(group_id: number | undefined, sender_id: string, groupname: string) {
         const url = `group/chat/add/${group_id}?sender_id=${sender_id}&groupname=${groupname}`
         return `${this.ServerUrl}${url}`;
     }

     ////////////// AUTH URL
     public static getLoginUrl() {
         const url = `login`;
         return `${this.ServerUrl}${url}`;
     };
     public static getLogoutUrl(user:string) {
         const url = `logout?user_id=${user}`;
         return `${this.ServerUrl}${url}`;
     };
     public static getRegisterUrl() {
         const url = `register`;
         return `${this.ServerUrl}${url}`;
     };



     ////////////// USER ROUTES
     public static getSetConnectionIdUrl(user_id: string, connectionid: string|any) {
         const url = `user/manage/connectionid?connectionid=${connectionid}&user_id=${user_id}`;
         return `${this.ServerUrl}${url}`;
     }
     public static getSetUserStatusUrl(user_id: string, status: number ) {
         const url = `user/manage/status?user_id=${user_id}&status=${status}`;
         return `${this.ServerUrl}${url}`;
     }
     public static getUserById(user_id: string) {
         const url = `user/users?user_id=${user_id}`;
         return `${this.ServerUrl}${url}`;
     }

     ////////////// GROUP ROUTES
     public static getSetConnectionIdForGroupUrl(user_id: string, connectionid: string | any) {
         const url = `group/manage/connectionid?connectionid=${connectionid}&user_id=${user_id}`;
         return `${this.ServerUrl}${url}`;
     }
     public static getGroupById(group_id: number) {
         const url = `group/groups/${group_id}`;
         return `${this.ServerUrl}${url}`;
     }

}

export default ServerLinks;