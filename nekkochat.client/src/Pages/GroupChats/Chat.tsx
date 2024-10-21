import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MainContainer } from '@chatscope/chat-ui-kit-react';

import ChatMessages from "./Components/ChatMessages";

import { getUserData } from "../../Store/Slices/userSlice";

import ChatSchema from "../../Schemas/ChatSchema";

import { useAppSelector, useAppDispatch } from "../../Hooks/storeHooks";
import useGetGroupsFromUser from "../../Hooks/Group/useGetGroupsFromUser";
import useGetUser from "../../Hooks/Group/useGetUser";
import useSignalServer from "../../Hooks/Group/useSignalServer";

import MessageServicesClient from "../../Utils/MessageServicesClient";
import useGetGroup from "../../Hooks/Group/useGetGroup";
import { iChatSchema, iTypingComponentProps } from "../../Constants/Types/CommonTypes";
export default function Chat() {
    const { chat_id } = useParams() as { chat_id: string };

    const [isTyping, setIsTyping] = useState<iTypingComponentProps>({
        typing: false,
        user_id: "0",
        username: "Member"
    });

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const addToChat = (user: string, username: string, msj: string, { typing, user_id, username:userN }: iTypingComponentProps) => {
        if (!msj && !user) {
            setIsTyping({ typing: typing, user_id: user_id, username: userN });
            setTimeout(() => {
                setIsTyping({ typing: false, user_id: user_id, username: userN });
            }, 3000);
            return;
        }
        setMessages((c: iChatSchema[]) =>
            [...c, new ChatSchema(Math.floor(Math.random()).toString(), user, username, msj, new Date().toJSON(), false)]);
    };

    const { loggedUser, user_id } = useGetUser(user);
    const { connected } = useSignalServer(loggedUser, addToChat);
    const { messages, setMessages, chatID, fetchMessage } = useGetGroupsFromUser();
    const { groupName } = useGetGroup(user_id, messages, chatID);

    useEffect(() => {
        dispatch(getUserData());
        fetchMessage(parseInt(chat_id));
        MessageServicesClient.sendReadMessageGroup(parseInt(chat_id), user_id, groupName);
    }, []);

    useEffect(() => {
        MessageServicesClient.sendReadMessageGroup(parseInt(chat_id), user_id, groupName);
    }, [user_id]);

    return (
        <MainContainer>
            <ChatMessages
                messages={messages}
                connected={connected}
                sender={user_id}
                receiver={chatID}
                isTyping={isTyping}
            />
        </MainContainer>
        
    );
};
