import axios from 'axios';
import ServerLinks from "../Constants/ServerLinks";
import MessageSchema from "../Schemas/MessageSchema";
import PrivateChatsServerServices from './PrivateChatsServerServices';
export default class MessageServicesClient {

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
};