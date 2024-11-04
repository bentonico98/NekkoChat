import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { MainContainer } from '@chatscope/chat-ui-kit-react';

import ChatMessages from "./Components/ChatMessages";
import "./PrivateChats.css";

import { getUserData } from "../../Store/Slices/userSlice";

import ChatSchema from "../../Schemas/ChatSchema";

import { useAppSelector, useAppDispatch } from "../../Hooks/storeHooks";
import useGetChatFromUser from "../../Hooks/useGetChatFromUser";
import useGetUser from "../../Hooks/useGetUser";
import useSignalServer from "../../Hooks/useSignalServer";

import MessageServicesClient from "../../Utils/MessageServicesClient";
import { iChatSchema, iTypingComponentProps } from "../../Constants/Types/CommonTypes";
export default function Chat() {
    const { chat_id } = useParams<string>();
 
    const [isTyping, setIsTyping] = useState<iTypingComponentProps>({
        typing: false,
        user_id: "0"
    });

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const addToChat = (user: string, msj: string, { typing, user_id }: iTypingComponentProps) => {
        if (!msj && !user) {
            setIsTyping({ typing: typing, user_id: user_id });
            setTimeout(() => {
                setIsTyping({ typing: false, user_id: user_id });
            }, 3000);
            return;
        }
        setMessages((c: iChatSchema[]) =>
            [...c, new ChatSchema(Math.floor(
                Math.random()).toString(),
                user,
                user,
                msj,
                new Date().toJSON(), false)]);
    };

    const { loggedUser, user_id } = useGetUser(user, "all");
    const { connected } = useSignalServer(loggedUser, addToChat);
    const { messages, currentConvo, setMessages, receiverID, fetchMessage } = useGetChatFromUser(user_id);

    useEffect(() => {
        dispatch(getUserData());
        fetchMessage(parseInt(chat_id || "0"));
        MessageServicesClient.sendReadMessage({
            chat_id: parseInt(chat_id || "0"),
            user_id
        });
    }, []);

    useEffect(() => {
        MessageServicesClient.sendReadMessage({
            chat_id: parseInt(chat_id || "0"),
            user_id
        });
    }, [user_id]);

    return (
        <MainContainer>
            <ChatMessages
                messages={messages}
                participants={currentConvo[0].participants}
                connected={connected}
                sender={user_id}
                receiver={receiverID}
                chat={parseInt(chat_id || "0")}
                isTyping={isTyping}
            />
        </MainContainer>
        
    );
};
