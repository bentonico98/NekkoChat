import { useEffect, useState } from "react";
import PrivateChatsServerServices from "../Utils/PrivateChatsServerServices";
import UserAuthServices from "../Utils/UserAuthServices";
export default function useSignalServer(user: any, addToChat: (user: string, msj: string) => void) {
    const [connected, setConnected] = useState<boolean>(false);
    const [conn, setConn] = useState<any>();

    const startServer = () => {
        PrivateChatsServerServices.Start(addToChat).then(async (res) => {
            setConnected(true);
            setConn(res);
        });
    }

    const setConnectionId = async (id:string, conn:any) => {
        const success = await UserAuthServices.SetConnectionId(id, conn);
        console.log(success);
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