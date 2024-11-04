import { useEffect, useState } from "react";
import { iTypingComponentProps, iuserStore } from "../../Constants/Types/CommonTypes";
import GroupChatsServerServices from "../../Utils/GroupChatsServerServices";
import UserAuthServices from "../../Utils/UserAuthServices";
export default function useSignalServer(user: iuserStore, addToChat: (user: string, username: string, msj: string, { typing, user_id }: iTypingComponentProps) => void) {
    const [connected, setConnected] = useState<boolean>(false);
    const [conn, setConn] = useState<string | undefined | null>();

    const startServer = () => {
        GroupChatsServerServices.Start(addToChat).then(async (res) => {
            setConnected(true);
            setConn(res);
        });
    }

    const setConnectionId = async (id: string, conn: string|undefined|null) => {
         await UserAuthServices.SetConnectionId(id, conn);
    }

    //Mantiene la conexion abierta
    useEffect(() => {
        if (!connected) {
            startServer();
        } else {
            return;
        }
    }, [connected, user]);

    useEffect(() => {
        if (user.value.id) {
            setConnectionId(user.value.id, conn);
        } 
    }, [conn]);

    return {connected, conn};
}