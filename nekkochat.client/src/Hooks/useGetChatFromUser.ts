import { useState } from "react";
import ChatSchema from "../Schemas/ChatSchema";
import MessageServicesClient from "../Utils/MessageServicesClient";

export default function useGetChatFromUser(user_id:string) {
    const [messages, setMessages] = useState<ChatSchema[]>([]);
    const [chatID, setChatID] = useState<string>("0");
    const [receiverID, setReceiverID] = useState<string>("0");
    const [currentConvo, setcurrentConvo] = useState<ChatSchema[]>([]);

    const setCurrentConversation = (chat_id: string | undefined) => {
        MessageServicesClient.getChatFromUser(chat_id).then((res) => {
            setcurrentConvo(res);
            var filter = res[0].messages.filter((i: any) => i.user_id != user_id);
            setMessages(res[0].messages);
            setReceiverID(filter[0].user_id);
            setChatID(res[0]._id);
        });
    }

    return { messages, setMessages, chatID, receiverID, currentConvo, fetchMessage: setCurrentConversation };
}