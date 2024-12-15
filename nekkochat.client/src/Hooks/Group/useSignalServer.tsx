import { useEffect, useState } from "react";
import { AddToGroupChatType, iDisplayMessageTypes,  iuserStore } from "../../Constants/Types/CommonTypes";
import GroupChatsServerServices from "../../Utils/GroupChatsServerServices";
import UserAuthServices from "../../Utils/UserAuthServices";

//
export default function useSignalServer(user: iuserStore, addToChat: AddToGroupChatType, DisplayMessage: (obj: iDisplayMessageTypes) => void) {
    const [connected, setConnected] = useState<boolean>(false);
    const [conn, setConn] = useState<string | null | undefined>();

    const startServer = async () => {
        const res = await GroupChatsServerServices.Listen(addToChat, DisplayMessage);
        setConnected(res.success);
        setConn(res.conn);
    }

    const setConnectionId = async (user_id: string, connectionid: string | null | undefined) => {
        DisplayMessage({ isLoading: true });

        const res = await UserAuthServices.SetConnectionId({
            user_id,
            connectionid
        });

        if (!res.success) {
            if (res.internalMessage) return DisplayMessage({
                hasError: true,
                error: res.internalMessage,
                isLoading: true
            });
            DisplayMessage({ hasError: true, error: res.error });
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