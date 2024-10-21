import { useEffect, useState } from "react";
import UserAuthServices from "../Utils/UserAuthServices";
import { iTypingComponentProps, iuserStore } from "../Constants/Types/CommonTypes";
import PrivateChatsServerServices from "../Utils/PrivateChatsServerServices";
export default function useSignalServer(user: iuserStore, addToChat: (user: string, msj: string, { typing,user_id }: iTypingComponentProps) => void) {
    const [connected, setConnected] = useState<boolean>(false);
    const [conn, setConn] = useState<string | null>();

    const startServer = () => {
        PrivateChatsServerServices.Start(addToChat).then(async (res) => {
            setConnected(true);
            setConn(res);
        });
    }

    const setConnectionId = async (id: string, conn: string | undefined | null) => {
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