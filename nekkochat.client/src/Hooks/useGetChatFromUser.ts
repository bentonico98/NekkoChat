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
        console.log(res);
        setcurrentConvo(res);
        setChatID(res[0]._id);
        var filter = res[0].participants.filter((i: iparticipants) => i.id !== user_id);
        setMessages(res[0].messages);
        setReceiverID(filter[0].id);
    };

    return { messages, setMessages, chatID, receiverID, currentConvo, fetchMessage: setCurrentConversation };
}