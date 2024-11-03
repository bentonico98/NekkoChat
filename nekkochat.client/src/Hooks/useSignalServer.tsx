import { useEffect, useState } from "react";
import UserAuthServices from "../Utils/UserAuthServices";
import { iDisplayMessageTypes, iuserStore } from "../Constants/Types/CommonTypes";
import PrivateChatsServerServices from "../Utils/PrivateChatsServerServices";
export default function useSignalServer(user: iuserStore, addToChat: any, DisplayMessage: (obj: iDisplayMessageTypes) => void) {
    const [connected, setConnected] = useState<boolean>(false);
    const [conn, setConn] = useState<string>("");

    const startServer = () => {
        PrivateChatsServerServices.Start(user.value.id, addToChat, DisplayMessage).then(async (res) => {
            setConnected(true);
            setConn(res || "");
        });
    }

    const setConnectionId = async (id: string, conn: string) => {
        const res = await UserAuthServices.SetConnectionId({
            user_id: id,
            sender_id: id,
            connectionid: conn
        });

        DisplayMessage({isLoading: true});

        if (res.success) {
            DisplayMessage({
                hasMsj: true,
                msj: res.message + " Established Connection.",
                isLoading: false
            });
        } else {
            if (res.internalMessage) return DisplayMessage({
                hasError: true,
                error: res.internalMessage,
                isLoading: true
            });
            DisplayMessage({
                hasError: true,
                error: res.error,
                isLoading: true
            });
        }
    }

    //Mantiene la conexion abierta
    useEffect(() => {
        if (!connected) {
            startServer();
        } 
    }, [user]);

    useEffect(() => {
        if (user.value.id && conn.length>0) {
            setConnectionId(user.value.id, conn);
        } 
    }, [conn]);

    return {connected, conn};
}