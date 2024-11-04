import { useEffect, useState } from "react";
import UserAuthServices from "../Utils/UserAuthServices";
import VideocallServerServices from "../Utils/VideoCallService";

export default function useVideocallSignalServer() {
    const [connected, setConnected] = useState<boolean>(false);
    const [conn, setConn] = useState<any>();

    const user = JSON.parse(localStorage.getItem("user") || '{}')

    const user_id = user.id;

    const startServer = async () => {
        const res = await VideocallServerServices.Start();
        if (res) {
            setConnected(true);
            setConn(res);
            console.log("start: " + user_id + " " + res.connectionId + " " + res.connection);
        } else {
            console.error("Failed to establish connection");
        }
    };

    const setConnectionId = async (id: string, conection: any) => {
        console.log("Set connection ID: " + user_id, conection?.connectionId);
         await UserAuthServices.SetConnectionId({
            user_id: id,
            sender_id: id,
            connectionid: conn?.connectionId
        });
    }

    //Mantiene la conexion abierta
    useEffect(() => {
        if (!connected) {
            startServer();
        } else {
            return;
        }
    }, [connected, user_id]);

    useEffect(() => {
        console.log("Connected state:", connected);
        console.log("Connection Object:", conn);
    }, [connected, conn]);

    useEffect(() => {
        console.log("Connection Object:", conn);
        if (user_id && conn && connected) {
            console.log("Setting connection ID: " + user_id, conn?.connectionId);
            setConnectionId(user_id, conn?.connectionId);
        } else {
            console.warn("Connection is undefined or not established");
        }
    }, [conn, user_id, connected]);

    return { connected, conn };
}