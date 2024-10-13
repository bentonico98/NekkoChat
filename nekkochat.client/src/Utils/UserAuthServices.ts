import ServerLinks from "../Constants/ServerLinks"
import axios from "axios";
import RegisterSchemas from "../Schemas/RegisterSchemas";
export default class UserAuthServices {

    public static async Login(payload: any) {
        const url = ServerLinks.getLoginUrl();

        const result = await axios.post(url, payload).then((res) => {
            console.log(res);
            return res.data;
        }).catch((err) => {
            console.log(err);
            return { success: false, user: null, msj: err, status: 500 };
        })

        return result;
    }

    public static async Logout(user:string) {
        const url = ServerLinks.getLogoutUrl(user);

        const result = await axios.put(url).then((res) => {
            console.log(res);
            return res.data;
        }).catch((err) => {
            console.log(err);
            return { success: false, user: null, msj: err, status: 500 };
        })

        return result;
    }

    public static async Register(payload: RegisterSchemas) {
        const url = ServerLinks.getRegisterUrl();
        
        const result = await axios.post(url, payload).then((res) => {
            console.log(res);
            return { success: true, user: res.data, status: res.status };
        }).catch((err) => {
            console.log(err);
            return { success: false, user: null, msj: err, status: 500 };
        });

        return result;
    }

    public static async SetConnectionId(user_id: string, connectionid: string) {
        if (!connectionid) return "500";
        if (!user_id) return "500";
        const url = ServerLinks.getSetConnectionIdUrl(user_id, connectionid);
        console.log(connectionid);

        const result = await axios.post(url).then((res) => {
            return res.status;
        }).catch((err) => {
            console.log(err);
            return "500";
        });

        return result;

    }

    public static async SetUserStatusTo(user_id: string, status: number) {
        if (!user_id) return "500";
        const url = ServerLinks.getSetUserStatusUrl(user_id, status);
        console.log(status);

        const result = await axios.put(url).then((res) => {
            console.log(res);
            return res.status;
        }).catch((err) => {
            console.log(err);
            return "500";
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
            return { success: false, user: null, msj: err, status: 500 };
        });

        return result;
    }

    public static isAuthenticated() {
        const user = localStorage.getItem("user");
        let isNull = user === null;
        return !isNull;
    }
}