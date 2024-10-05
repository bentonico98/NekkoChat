import axios from 'axios';
import ServerLinks from "../Constants/ServerLinks";
import MessageSchema from "../Schemas/MessageSchema";
import PrivateChatsServerServices from './PrivateChatsServerServices';
import GroupMessageSchema from '../Schemas/GroupMessageSchema';
import GroupChatsServerServices from './GroupChatsServerServices';
export default class MessageServicesClient {


    ///////////////// PRIVATES CHATS SERVICES


    public static async sendMessageToUser(chat_id: number, sender_id: string, receiver_id: string, msj: string) {

        let url = ServerLinks.getSendMessageUrl(new MessageSchema(chat_id, sender_id, receiver_id, msj, sender_id, "user", new Date("YYYY-MM-DD HH:mm:ss").toJSON()));
        const value = msj;
        const result = await axios.put(url,
            value, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await PrivateChatsServerServices.SendMessageToUserInvoke(sender_id, receiver_id, msj);
        return result;
    }

    public static async sendReadMessage(chat_id: string | undefined, sender_id: string) {
        if (!sender_id) return false;
      
        let url = ServerLinks.getReadMessageUrl(chat_id, sender_id);

        const result = await axios.put(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log(res);
        }).catch(err => {
            console.error(err);
        });

        return result;
    }

    public static async getUserById(user_id: string) {
        let url = ServerLinks.getUserById(user_id);

        const result = await axios.get(url).then((res) => {
            return res.data;
        }).catch((err) => {
            console.log(err);
            return err;
        });

        return result;
    }

    public static async getAllUsersChats(user_id: string) {

        let url = ServerLinks.getAllUsersChatUrl(user_id);

        const result = await axios.get(url).then((res) => {
            //console.log(res);

            return res.data;
        }).catch(function (error) {
            // handle error
            console.log(error);
        }).finally(async function () {
            // always executed
            //console.log('funcciono?');
        });
        //console.log(result);

        return result;
    }

    public static async getChatFromUser(chat_id: string|undefined) {
        let url = ServerLinks.getOneUsersChatUrl(chat_id);

        const result = await axios.get(url).then((res) => {
            //console.log(res);

            return res.data;
        }).catch(function (error) {
            // handle error
            console.log(error);
        }).finally(async function () {
            // always executed
            //console.log('funcciono?');
        });

        //console.log(result);

      
        return result;
    }


    ///////////////// GROUPS SERVICES

    public static async getGroupById(group_id: number) {
        if (!group_id) return;
        let url = ServerLinks.getGroupById(group_id);

        const result = await axios.get(url).then((res) => {
            console.log(res);
            return res.data;
        }).catch((err) => {
            console.log(err);
            return err;
        });

        return result;
    }

    public static async getAllGroupsChats(user_id: string) {

        let url = ServerLinks.getAllGroupsChatUrl(user_id);

        const result = await axios.get(url).then((res) => {
            //console.log(res);
            return res.data;
        }).catch(function (error) {
            // handle error
            console.log(error);
        }).finally(async function () {
            // always executed
            //console.log('funcciono?');
        });
        //console.log(result);

        return result;
    }

    public static async getGroupFromUser(chat_id: number) {
        let url = ServerLinks.getOneGroupChatUrl(chat_id);

        const result = await axios.get(url).then((res) => {
            //console.log(res);

            return res.data;
        }).catch(function (error) {
            // handle error
            console.log(error);
        }).finally(async function () {
            // always executed
            //console.log('funcciono?');
        });

        //console.log(result);


        return result;
    }

    public static async sendMessageToGroup(group_id: number, sender_id: string, groupname: string, grouptype: string, groupdesc: string, groupphoto: string, msj: string) {

        let url = ServerLinks.getSendMessageToGroupUrl(new GroupMessageSchema(group_id, groupname, grouptype, groupdesc, groupphoto, msj, sender_id));
        const value = msj;
        const result = await axios.put(url,
            value, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        await GroupChatsServerServices.SendMessageToGroupInvoke(sender_id, group_id, msj);
        return result;
    }

    public static async sendReadMessageGroup(group_id: number| undefined, sender_id: string, groupname:string) {
        if (!sender_id) return false;
        if (!group_id) return false;
        if (!groupname) return false;

        let url = ServerLinks.getReadGroupMessageUrl(group_id, sender_id, groupname);

        const result = await axios.put(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log(res);
        }).catch(err => {
            console.error(err);
        });

        return result;
    }
    public static async addParticipantToGroup(group_id: number | undefined, sender_id: string, groupname: string) {
        if (!sender_id) return false;
        if (!group_id) return false;
        if (!groupname) return false;

        let url = ServerLinks.getAddParticipantToGroupUrl(group_id, sender_id, groupname);

        const result = await axios.put(url, {
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((res) => {
            console.log(res);
        }).catch(err => {
            console.error(err);
        });

        return result;
    }
};