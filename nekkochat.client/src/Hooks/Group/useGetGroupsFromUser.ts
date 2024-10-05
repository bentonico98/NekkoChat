import { useState, useCallback } from "react";
import GroupChatSchema from "../../Schemas/GroupChatSchema";
import MessageServicesClient from "../../Utils/MessageServicesClient";

export default function useGetChatFromUser() {
    const [messages, setMessages] = useState<GroupChatSchema[]>([]);
    const [chatID, setChatID] = useState<string>("0");
    const [currentConvo, setcurrentConvo] = useState<GroupChatSchema[]>([]);

    const setCurrentConversation = useCallback((group_id: number) => {
        MessageServicesClient.getGroupFromUser(group_id).then((res) => {
            setcurrentConvo(res);
            setMessages(res[0].messages);
            setChatID(res[0]._id);
        });
    }, []);

    return { messages, setMessages, chatID, currentConvo, fetchMessage: setCurrentConversation };
}