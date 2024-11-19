import { useState } from "react";
import MessageServicesClient from "../Utils/MessageServicesClient";
import { iChatSchema, iConversationClusterProps, iDisplayMessageTypes, iparticipants } from "../Constants/Types/CommonTypes";
export default function useGetChatFromUser(user_id: string, DisplayMessage: (obj: iDisplayMessageTypes)=> void) {
    const [messages, setMessages] = useState<iChatSchema[]>([]);
    const [chatID, setChatID] = useState<number>(0);
    const [receiverID, setReceiverID] = useState<string>("0");
    const [currentConvo, setcurrentConvo] = useState<iConversationClusterProps[]>([]);

    const setCurrentConversation = async (chat_id: number) => {
        DisplayMessage({ isLoading: true });

        const res = await MessageServicesClient.getChatFromUser(chat_id);
        if (res.success) {
            setcurrentConvo(res.user);
            setChatID(res.user[0]._id);
            var filter = res.user[0].participants.filter((i: iparticipants) => i.id !== user_id);
            setMessages(res.user[0].messages);
            setReceiverID(filter[0].id);
            DisplayMessage({ isLoading: false });

        } else {
            if (res.internalMessage) return DisplayMessage({
                hasError: true,
                error: res.internalMessage,
                isLoading: true
            });
            DisplayMessage({
                hasError: true,
                error: res.error,
                isLoading: true
            });
        }
    };

    return { messages, setMessages, chatID, receiverID, currentConvo, fetchMessage: setCurrentConversation };
}