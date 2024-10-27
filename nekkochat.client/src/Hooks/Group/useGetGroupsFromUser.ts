import { useState, useCallback } from "react";
import MessageServicesClient from "../../Utils/MessageServicesClient";
import { iChatSchema } from "../../Constants/Types/CommonTypes";

export default function useGetChatFromUser() {
    const [messages, setMessages] = useState<iChatSchema[]>([]);
    const [chatID, setChatID] = useState<number>(0);
    const [currentConvo, setcurrentConvo] = useState<iChatSchema[]>([]);

    const setCurrentConversation = useCallback((group_id: number) => {
        MessageServicesClient.getGroupFromUser(group_id).then((res) => {
            if (res.success) {
                setcurrentConvo(res.user);
                setMessages(res.user[0].messages);
                setChatID(res.user[0]._id);
            }
        });
    }, []);

    return { messages, setMessages, chatID, currentConvo, fetchMessage: setCurrentConversation };
}