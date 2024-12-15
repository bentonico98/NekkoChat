import { useEffect, useState } from "react";
import UserAuthServices from "../Utils/UserAuthServices";
import { iDisplayMessageTypes, iuserStore, AddToPrivateChatType } from "../Constants/Types/CommonTypes";
import PrivateChatsServerServices from "../Utils/PrivateChatsServerServices";
export default function useSignalServer(user: iuserStore, addToChat: AddToPrivateChatType, DisplayMessage: (obj: iDisplayMessageTypes) => void) {
    const [connected, setConnected] = useState<boolean>(false);
    const [conn, setConn] = useState<string | null | undefined>();

    const startServer = async () => {
        const res = await PrivateChatsServerServices.Listen(addToChat, DisplayMessage);
        setConnected(res.success)
        setConn(res.conn);
    }

    const setConnectionId = async (id: string, conn: string) => {
        DisplayMessage({ isLoading: true });

        const res = await UserAuthServices.SetConnectionId({
            user_id: id,
            sender_id: id,
            connectionid: conn
        });

        if (!res.success) {
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
        DisplayMessage({ isLoading: false });
    }

    //Mantiene la conexion abierta
    useEffect(() => {
        if (!connected) {
            startServer();
        } 
    }, [connected, user]);

    useEffect(() => {
        if (user.value.id && conn) {
            setConnectionId(user.value.id, conn);
        } else {
            DisplayMessage({ isLoading:true });
        }
    }, [conn]);

    return { connected, conn };
}