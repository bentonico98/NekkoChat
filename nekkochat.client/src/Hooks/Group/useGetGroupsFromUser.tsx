import { useState} from "react";
import MessageServicesClient from "../../Utils/MessageServicesClient";
import { iChatSchema, iConversationClusterProps, iDisplayMessageTypes } from "../../Constants/Types/CommonTypes";

export default function useGetChatFromUser(DisplayMessage: (obj: iDisplayMessageTypes) => void) {
    const [messages, setMessages] = useState<iChatSchema[]>([]);
    const [chatID, setChatID] = useState<number>(0);
    const [currentConvo, setcurrentConvo] = useState<iConversationClusterProps[]>([]);

    const setCurrentConversation = (group_id: number) => {
        DisplayMessage({ isLoading: true });

        MessageServicesClient.getGroupFromUser(group_id).then((res) => {
            if (res.success) {
                setcurrentConvo(res.user);
                setMessages(res.user[0].messages);
                setChatID(res.user[0]._id);
                DisplayMessage({ isLoading: false });

            } else {
                if (res.internalMessage) return DisplayMessage({
                    hasError: true,
                    error: res.internalMessage,
                    isLoading: false
                });
                DisplayMessage({
                    hasError: true,
                    error: res.error,
                    isLoading: false
                });
            }
        });
        DisplayMessage({ isLoading: false });
    }

    return { messages, setMessages, chatID, currentConvo, fetchMessage: setCurrentConversation };
}