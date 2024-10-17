import ServerLinks from "../Constants/ServerLinks"
import axios from "axios";
import RegisterSchemas from "../Schemas/RegisterSchemas";
export default class UserAuthServices {

    public static async Login(payload: any) {
        const url = ServerLinks.getLoginUrl();

        const result = await axios.post(url, payload).then((res) => {
            console.log(res.data);
            return res.data;
        }).catch((err) => {
            console.log(err);
            return { success: false, user: null, msj: err };
        })

        return result;
    }

    public static async Register(payload: RegisterSchemas) {
        const url = ServerLinks.getRegisterUrl();
        
        const result = await axios.post(url, payload).then((res) => {
            console.log(res);
            return res.data;
        }).catch((err) => {
            console.log(err);
            return {success:false, user:null, msj: err};
        });

        return result;
    }

    public static async SetConnectionId(user_id: any, connectionid: any) {
        if (!connectionid) return "500";
        if (!user_id) return "500";
        const url = ServerLinks.getSetConnectionIdUrl(user_id, connectionid);
        console.log(connectionid);
        console.log(user_id);

        const result = await axios.post(url).then((res) => {
            return res.status;
        }).catch((err) => {
            console.log(err);
            return "500";
        });

        return result;

    }

    public static isAuthenticated() {
        const user = localStorage.getItem("user");
        let isNull = user === null;
        return !isNull;
    }
}