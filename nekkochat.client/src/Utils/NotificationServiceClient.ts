import axios from "axios";
import ServerLinks from "../Constants/ServerLinks";
import { iNotificationTypes } from "../Constants/Types/CommonTypes";
import ResponseViewModel from "../Model/ReponseViewModel";

export default class NotificationServiceClient {

    public static async GetAllNotification(user_id: string) {
        const url = ServerLinks.getAllUserNotificationUrl(user_id);

        const res = await axios.get(url).then((res) => {
            return res.data;
        }).catch((err) => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return res;
    }

    public static async CreateNotification(data: iNotificationTypes) {
        const url = ServerLinks.getCreateNotificationUrl();

        const res = await axios.post(url, data).then((res) => {
            return res.data;
        }).catch((err) => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return res;
    }

    public static async ReadNotification(data: iNotificationTypes) {
        const url = ServerLinks.getReadNotificationUrl(data.user_id);

        const res = await axios.put(url, data).then((res) => {
            return res.data;
        }).catch((err) => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return res;
    }
    public static async DeleteNotification(data: iNotificationTypes) {
        const url = ServerLinks.getDeleteNotificationUrl(data.user_id);

        const res = await axios.delete(url, data).then((res) => {
            return res.data;
        }).catch((err) => {
            console.error(err);
            return new ResponseViewModel(false, 500, null, null, err.response.data.error);
        });

        return res;
    }
}