import ServerLinks from "../Constants/ServerLinks"
import axios from "axios";
import RegisterSchemas from "../Schemas/RegisterSchemas";
import ResponseViewModel from "../Model/ReponseViewModel";
import { iServerRequestTypes } from "../Constants/Types/CommonTypes";
export default class UserAuthServices {

    public static async Login(payload: any) {
        const url = ServerLinks.getLoginUrl();

        const result = await axios.post(url, payload).then((res) => {
            console.log(res.status);
            console.log(res.data);
            return res.data;
        }).catch((err) => {
            console.log(err);
            return new ResponseViewModel(false, 500, null, null, err);
        })

        return result;
    }

    public static async Logout(data: iServerRequestTypes) {
        const url = ServerLinks.getLogoutUrl();

        const result = await axios.put(url, data).then((res) => {
            return res.data;
        }).catch((err) => {
            console.log(err);
            return new ResponseViewModel(false, 500, null, null, err);
        })

        return result;
    }

    public static async Register(data: RegisterSchemas) {
        const url = ServerLinks.getRegisterUrl();

        const result = await axios.post(url, data).then((res) => {
            console.log(res);
            return res.data;
        }).catch((err) => {
            console.log(err);
            return new ResponseViewModel(false, 500, null, null, err);
        });

        return result;
    }

    public static async SetConnectionId(data: iServerRequestTypes) {
        if (!data.connectionid) return new ResponseViewModel(false, 500, null, null, "Missing Values");
        if (!data.user_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");

        const url = ServerLinks.getSetConnectionIdUrl();

        const result = await axios.post(url, data).then((res) => {
            return res.status;
        }).catch((err) => {
            console.log(err);
            return new ResponseViewModel(false, 500, null, null, err);
        });

        return result;

    }

    public static async SetUserStatusTo(data: iServerRequestTypes, status: number) {
        if (!data.user_id) return new ResponseViewModel(false, 500, null, null, "Missing Values");

        const url = ServerLinks.getSetUserStatusUrl(status);
        console.log(status);

        const result = await axios.put(url, data).then((res) => {
            console.log(res);
            return res.data;
        }).catch((err) => {
            console.log(err);
            return new ResponseViewModel(false, 500, null, null, err);
        });

        return result;
    }

    public static async SearchUserByName(name: string) {
        const url = ServerLinks.getUserByName(name);

        const result = await axios.get(url).then((res) => {
            console.log(res);
            return { success: true, user: res.data, status: res.status };
        }).catch((err) => {
            console.log(err);
            return new ResponseViewModel(false, 500, null, null, err);
        });

        return result;
    }

    public static async GetUserFriends(user_id: string, operation: string) {
        const url = ServerLinks.getUserFriends(user_id, operation);

        const result = await axios.get(url).then((res) => {
            console.log(res);
            return res.data;
        }).catch((err) => {
            console.log(err);
            return new ResponseViewModel(false, 500, null, null, err);
        });

        return result;
    }
    public static async GetSendFriendRequest(data: iServerRequestTypes) {
        const url = ServerLinks.getSendFriendRequest();

        const result = await axios.post(url, {
            data
        }).then((res) => {
            console.log(res);
            return res.data;
        }).catch((err) => {
            console.log(err);
            return new ResponseViewModel(false, 500, null, null, err);
        });

        return result;
    }
    public static async GetManageFriendRequest(data: iServerRequestTypes) {
        const url = ServerLinks.getManageFriendRequest();

        const result = await axios.patch(url, data).then((res) => {
            console.log(res);
            return res.data;
        }).catch((err) => {
            console.log(err);
            return new ResponseViewModel(false, 500, null, null, err);
        });

        return result;
    }
    public static isAuthenticated() {
        const user = localStorage.getItem("user");
        let isNull = user === null;
        return !isNull;
    }
}