import axios from 'axios';
import ServerLinks from "../Constants/ServerLinks";
import PrivateChatsServerServices from './PrivateChatsServerServices';
import GroupChatsServerServices from './GroupChatsServerServices';
import { iGroupRequestTypes, iServerRequestTypes } from '../Constants/Types/CommonTypes';
import ResponseViewModel from '../Model/ReponseViewModel';
export default class MessageServicesClient {


    ///////////////// PRIVATES CHATS SERVICES


    public static async sendMessageToUser(data: iServerRequestTypes) {

        let url = ServerLinks.getSendMessageUrl();
        const result = await axios.put(url, data).then((res) => {
            console.log(res.status);
            return res.data;
        }).catch(err => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });;
        await PrivateChatsServerServices.SendMessageToUserInvoke(data);
        return result;
    }

    public static async sendReadMessage(data: iServerRequestTypes) {
        if (!data.sender_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");

        let url = ServerLinks.getReadMessageUrl(data.chat_id);

        const result = await axios.put(url, data).then((res) => {
            console.log(res.status);
            return res.data;
        }).catch(err => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return result;
    }

    public static async deleteMessageFromChat(data: iServerRequestTypes | any) {
        if (!data.sender_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");

        let url = ServerLinks.getDeleteMessageUrl(data.chat_id);

        const result = await axios.delete(url, data).then((res) => {
            console.log(res.status);
            return res.data;
        }).catch(err => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return result;
    }

    public static async deleteChat(data: iServerRequestTypes | any) {
        if (!data.sender_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");

        let url = ServerLinks.getDeleteMessageUrl(data);

        const result = await axios.delete(url, data).then((res) => {
            console.log(res.status);
            return res.data;
        }).catch(err => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return result;
    }

    public static async deleteUserChat(data: iServerRequestTypes) {
        if (!data.sender_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");
        if (!data.chat_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");
    }

    public static async manageChat(data: iServerRequestTypes) {
        if (!data.user_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");

        let url = ServerLinks.getManageChatUrl(data.chat_id);

        const result = await axios.put(url, data).then((res) => {
            return res.data;
        }).catch(err => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return result;
    }

    public static async createChat(data: iServerRequestTypes) {
        let url = ServerLinks.getCreateChatUrl();

        const result = await axios.post(url, data).then((res) => {
            return res.data;
        }).catch(err => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return result;
    }


    //// USER SERVICES
    public static async getUserById(user_id: string, sender_id:string) {
        let url = ServerLinks.getUserById(user_id, sender_id);

        const result = await axios.get(url).then((res) => {
            return res.data;
        }).catch((err) => {
            console.log(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return result;
    }

    public static async getAllUsersChats(user_id: string, type:string) {

        let url = ServerLinks.getAllUsersChatUrl(user_id,type);

        const result = await axios.get(url).then((res) => {
            return res.data;
        }).catch(function (error) {
            // handle error
            console.log(error);
            return new ResponseViewModel(false, 500, null, null, error);
        }).finally(async function () {
            // always executed
            //console.log('funcciono?');
        });

        return result;
    }

    public static async getChatFromUser(chat_id: number) {
        let url = ServerLinks.getOneUsersChatUrl(chat_id);

        const result = await axios.get(url).then((res) => {
            console.log(res);
            return res.data;
        }).catch(function (error) {
            // handle error
            console.log(error);
            return new ResponseViewModel(false, 500, null, null, error);
        }).finally(async function () {
            // always executed
            //console.log('funcciono?');
        });

        return result;
    }


    ///////////////// GROUPS SERVICES

    public static async getGroupById(group_id: number) {
        if (!group_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");

        let url = ServerLinks.getGroupById(group_id);

        const result = await axios.get(url).then((res) => {
            return res.data;
        }).catch((err) => {
            console.log(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return result;
    }

    public static async getAllGroupsChats(user_id: string) {

        let url = ServerLinks.getAllGroupsChatUrl(user_id);

        const result = await axios.get(url).then((res) => {
            return res.data;
        }).catch(function (error) {
            // handle error
            console.log(error);
            return new ResponseViewModel(false, 500, null, null, error);
        }).finally(async function () {
            // always executed
            //console.log('funcciono?');
        });

        return result;
    }

    public static async getGroupFromUser(chat_id: number) {
        let url = ServerLinks.getOneGroupChatUrl(chat_id);

        const result = await axios.get(url).then((res) => {
            return res.data;
        }).catch(function (error) {
            // handle error
            console.log(error);
            return new ResponseViewModel(false, 500, null, null, error);
        }).finally(async function () {
            // always executed
            //console.log('funcciono?');
        });


        return result;
    }

    public static async sendMessageToGroup(data: iGroupRequestTypes) {

        let url = ServerLinks.getSendMessageToGroupUrl(data.group_id);

        const result = await axios.put(url, data).then((res) => {
            return res.data;
        }).catch(err => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        await GroupChatsServerServices.SendMessageToGroupInvoke(data);
        return result;
    }

    public static async sendReadMessageGroup(data: iGroupRequestTypes) {
        if (!data.sender_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");
        if (!data.group_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");
        if (!data.groupname) return new ResponseViewModel(false, 500, null, null, "Missing Values");

        let url = ServerLinks.getReadGroupMessageUrl(data.group_id);

        const result = await axios.put(url, data).then((res) => {
            return res.data;
        }).catch(err => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return result;
    }
    public static async addParticipantToGroup(data: iGroupRequestTypes) {
        if (!data.sender_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");
        if (!data.group_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");
        if (!data.groupname) return new ResponseViewModel(false, 500, null, null, "Missing Values");

        let url = ServerLinks.getAddParticipantToGroupUrl(data.group_id);

        const result = await axios.put(url, data).then((res) => {
            return res.data;
        }).catch(err => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return result;
    }
    public static async createGroup(data: iGroupRequestTypes) {
        if (!data.sender_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");
        if (!data.groupname) return new ResponseViewModel(false, 500, null, null, "Missing Values");

        let url = ServerLinks.getCreateGroupChatUrl();

        const result = await axios.post(url, data).then((res) => {
            console.log(res);
            return res.data;
        }).catch(err => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return result;
    }
};