 class ServerLinks {
     private static ServerUrl = "https://localhost:7198/";

     ///////////////// PRIVATE CHATS URLS

     public static getCreateChatUrl() {
         const url = `chats/chat/create`
         return `${this.ServerUrl}${url}`;
     };
     public static getSendMessageUrl() {
         const url = `chats/chat/send`
        return `${this.ServerUrl}${url}`;
     };
     public static getAllUsersChatUrl(id: string, type: string) {
         const url = `chats/chats?id=${id}&type=${type}`
         return `${this.ServerUrl}${url}`;
     };
     public static getOneUsersChatUrl(id: number) {
         const url = `chats/chat/${id}`
         return `${this.ServerUrl}${url}`;
     };
     public static getReadMessageUrl(chat_id: number | undefined) {
         const url = `chats/chat/read/${chat_id}`
         return `${this.ServerUrl}${url}`;
     }

     public static getDeleteMessageUrl(chat_id: number | undefined) {
         const url = `chats/chat/message/delete/${chat_id}`;
         return `${this.ServerUrl}${url}`;
     }

     public static getManageChatUrl(chat_id: number | undefined) {
         const url = `chats/chat/manage/${chat_id}`;
         return `${this.ServerUrl}${url}`;
     }
     ///////// GROUP CHAT URLS

     public static getCreateGroupChatUrl() {
         const url = `group/chat/create`
         return `${this.ServerUrl}${url}`;
     };
     public static getSendMessageToGroupUrl(id: number) {
         const url = `group/chat/send/${id}`
         return `${this.ServerUrl}${url}`;
     };
     public static getAllGroupsChatUrl(id: string) {
         const url = `group/chats?user_id=${id}`
         return `${this.ServerUrl}${url}`;
     };
     public static getOneGroupChatUrl(id: number) {
         const url = `group/chat/${id}`
         return `${this.ServerUrl}${url}`;
     };
     public static getReadGroupMessageUrl(id:number) {
         const url = `group/chat/read/${id}`
         return `${this.ServerUrl}${url}`;
     }
     public static getAddParticipantToGroupUrl(id: number) {
         const url = `group/chat/add/${id}`
         return `${this.ServerUrl}${url}`;
     }

     ////////////// AUTH URL
     public static getLoginUrl() {
         const url = `login`;
         return `${this.ServerUrl}${url}`;
     };
     public static getLogoutUrl() {
         const url = `logout`;
         return `${this.ServerUrl}${url}`;
     };
     public static getRegisterUrl() {
         const url = `register`;
         return `${this.ServerUrl}${url}`;
     };



     ////////////// USER ROUTES
     public static getSetConnectionIdUrl() {
         const url = `user/manage/connectionid`;
         return `${this.ServerUrl}${url}`;
     }
     public static getSetUserStatusUrl(status: number) {
         const url = `user/manage/status?status=${status}`;
         return `${this.ServerUrl}${url}`;
     }
     public static getUserById(user_id: string) {
         const url = `user/users?user_id=${user_id}`;
         return `${this.ServerUrl}${url}`;
     }
     public static getUserByName(name: string) {
         const url = `user/user?name=${name}`;
         return `${this.ServerUrl}${url}`;
     }
     public static getUserFriends(user_id:string, operation:string) {
         const url = `user/friends?user_id=${user_id}&operation=${operation}`;
         return `${this.ServerUrl}${url}`;
     }
     public static getSendFriendRequest() {
         const url = `user/manage/friendrequest/send`;
         return `${this.ServerUrl}${url}`;
     }
     public static getManageFriendRequest() {
         const url = `user/manage/friendrequest/response`;
         return `${this.ServerUrl}${url}`;
     }


     ////////////// GROUP ROUTES
     public static getSetConnectionIdForGroupUrl() {
         const url = `group/manage/connectionid`;
         return `${this.ServerUrl}${url}`;
     }
     public static getGroupById(group_id: number) {
         const url = `group/groups/${group_id}`;
         return `${this.ServerUrl}${url}`;
     }

}

export default ServerLinks;