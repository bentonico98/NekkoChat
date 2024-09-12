import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import ChatMessages from "./Components/ChatMessages";
import ChatBox from "./Components/ChatBox";
import "./PrivateChats.css";
import MessageServicesClient from "../../Utils/MessageServicesClient";
import PrivateChatsServerServices from "../../Utils/PrivateChatsServerServices";
import ChatSchema from "../../Schemas/ChatSchema";
export default function Chat() {
    const { chat_id } = useParams();
    const [messages, setMessages] = useState<any>([]);
    const [connected, setConnected] = useState<boolean>(false);

    useEffect(() => {
        MessageServicesClient.getChatFromUser(chat_id!.toString()).then((res) => {
            setMessages(res);
        });

    }, []);

    const sendMessage = async (msj: string, chat_id: number, sender_id: number, receiver_id: number) => {
        await MessageServicesClient.sendMessageToUser(chat_id, sender_id, receiver_id, msj);
        PrivateChatsServerServices.SendMessageInvoke(msj, chat_id);
        return { sender_id: sender_id, receiver_id: receiver_id };
    };

    const addToChat = (user: string, msj: string) => {
        if (!msj) return;
        setMessages((c: any) =>
            [...c, new ChatSchema(user, msj, new Date().toJSON())]);
    };

    //Mantiene la conexion abierta
    useEffect(() => {
        if (!connected) {
            PrivateChatsServerServices.Start(addToChat).then((res) => {
                setConnected(true);
                return res;
            });
        } else {
            return;
        }
    });

    return (
        <div className="mainContainer">
            <h1>Chat: {chat_id}</h1>

            <ChatMessages messages={messages} />
            <ChatBox sendMessage={sendMessage} connected={connected} />
        </div>
    );
};