import { useState } from "react";
import MessageServicesClient from "../Utils/MessageServicesClient";
import { iChatSchema, iConversationClusterProps, iparticipants } from "../Constants/Types/CommonTypes";

export default function useGetChatFromUser(user_id:string) {
    const [messages, setMessages] = useState<iChatSchema[]>([]);
    const [chatID, setChatID] = useState<number>(0);
    const [receiverID, setReceiverID] = useState<string>("0");
    const [currentConvo, setcurrentConvo] = useState<iConversationClusterProps[]>([]);

    const setCurrentConversation = async (chat_id: number) => {
        const res = await MessageServicesClient.getChatFromUser(chat_id);
        if (res.success) {
            setcurrentConvo(res.user);
            setChatID(res.user[0]._id);
            var filter = res.user[0].participants.filter((i: iparticipants) => i.id !== user_id);
            setMessages(res.user[0].messages);
            setReceiverID(filter[0].id);
        }
        
    };

    return { messages, setMessages, chatID, receiverID, currentConvo, fetchMessage: setCurrentConversation };
}