import "./Inbox.css";

import { useState, useEffect } from "react";

import SideBox from "./Components/SideBox";
import ChatMessages from "./Components/ChatMessages";
import ChatBox from "./Components/ChatBox";
import MessageServicesClient from "../../Utils/MessageServicesClient";
import PrivateChatsServerServices from "../../Utils/PrivateChatsServerServices";
import ChatSchema from "../../Schemas/ChatSchema";

export default function Inbox() {

    const user_id = 2;
    const [conversations, setconversations] = useState<any>([{ _id: "", messages: [{ id: 0, content: "", user_id: 0, username: "Guest", created_at: new Date("YYYY-MM-DD HH:mm:ss").toJSON() }], participants: [{ id: "0", name: "guest" }, { id: "0", name: "guest" }] }]);
    const [currentConvo, setcurrentConvo] = useState<ChatSchema[]>([]);
    const [chatID, setChatID] = useState<string>("0");
    const [receiverID, setReceiverID] = useState<string>("0");



    const [connected, setConnected] = useState<boolean>(false);
    const [conn, setConn] = useState<any>();

    const sendMessage = async (msj: string, chat_id: number, sender_id: number, receiver_id: number) => {

        if (!msj) return;
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
        MessageServicesClient.getAllUsersChats(user_id.toString()).then((res) => {
            setconversations(res);
        });
    });


    useEffect(() => {
       

    }, []);


    const setCurrentConversation = (chat_id: number) => {
        MessageServicesClient.getChatFromUser(chat_id.toString()).then((res) => {
            setcurrentConvo(res);
            var filter = res[0].messages.filter((i: any) => i.user_id != user_id);
            setReceiverID(filter[0].user_id);
            setChatID(res[0]._id);
        });
    }
    return (
        <main>
            {conversations.length > 0 && <SideBox messages={conversations} setCurrentConversation={setCurrentConversation} />}
            
            <div>
                <h1>NekkoChat -- Inbox</h1>

                <ChatMessages messages={currentConvo} />
                <ChatBox sendMessage={sendMessage} sender={user_id} receiver={receiverID} chat={chatID} />
            </div>
        </main>
    );
}