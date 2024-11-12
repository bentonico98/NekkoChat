import { useEffect, useState } from "react";
import ServerInstance from "../../Constants/ServerInstance";

export default function useServer() {
    const [established, setEstablished] = useState<boolean>(false);

    const ServerUp = async () => {
        const isPrivateConnected = await ServerInstance.StartPrivateServer();
        const isGroupConnected = await ServerInstance.StartGroupServer();

        if (isPrivateConnected.state === "Connected" && isGroupConnected.state === "Connected") {
            setEstablished(true);
            console.log("SERVER UP");
        } else {
            ServerUp();
        }
    }

    useEffect(() => {
        ServerUp();
    }, []);

    return { established };
}