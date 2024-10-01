import "./PrivateChats.css";
import { useState, useEffect } from "react";
//import * as signalR from "@microsoft/signalr";
import ChatMessages from "./Components/ChatMessages";
import ChatBox from "./Components/ChatBox";
import ChatSchema from "../../Schemas/ChatSchema";
import MessageServicesClient from "../../Utils/MessageServicesClient";
import PrivateChatsServerServices from "../../Utils/PrivateChatsServerServices";

export default function PrivateChats() {
    const user_id = 2;
    const [conversations, setconversations] = useState<ChatSchema[]>([]);
    const [connected, setConnected] = useState<boolean>(false);
    const [conn, setConn] = useState<any>();

    const sendMessage = async (msj: string, chat_id: number, sender_id: string, receiver_id: string) => {

        const result = await MessageServicesClient.sendMessageToUser(chat_id, sender_id, receiver_id, msj);
        try {
            conn.invoke("SendMessage", "User", msj);
        } catch (er) {
            console.log(er);
        }
        return result;
    };

    const addToChat = (user: string, msj: string) => {
        if (!msj) return;
        setconversations((c: any) =>
            //[...c, new ChatSchema(user, msj, new Date("YYYY-MM-DD HH:mm:ss").toJSON())]);
            [...c, { id: Math.floor(Math.random()), content: msj, username: user, user_id: user_id, created_at: new Date("YYYY-MM-DD HH:mm:ss").toJSON() }]);

    };
    //Mantiene la conexion abierta
    useEffect(() => {
        if (!connected) {
            PrivateChatsServerServices.Start(addToChat).then((res) => {
                setConnected(true);
                setConn(res);
            });
        } else {
            return;
        }
    });


    useEffect(() => {
        MessageServicesClient.getAllUsersChats(user_id.toString()).then((res) => {
            setconversations(res);
        });
        
    }, [conn]);


    return (
        <div className="mainContainer">
            <h1>NekkoChat -- Demo</h1>
            <ChatMessages messages={conversations} />
            <ChatBox sendMessage={sendMessage} connected={connected} />
        </div>
    );
};