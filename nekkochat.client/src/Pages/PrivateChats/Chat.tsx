import { useParams } from "react-router-dom";
import { useEffect } from "react";
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
export default function Chat() {
    const { chat_id } = useParams<string>();

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const addToChat = (user: string, msj: string) => {
        if (!msj) return;
        setMessages((c: any) =>
            [...c, new ChatSchema(Math.floor(Math.random()).toString(), user, user, msj, new Date().toJSON(), false)]);
    };

    const { loggedUser, user_id } = useGetUser(user);
    const { connected } = useSignalServer(loggedUser, addToChat);
    const { messages, setMessages, receiverID, fetchMessage } = useGetChatFromUser(user_id);

    useEffect(() => {
        dispatch(getUserData());
        fetchMessage(chat_id);
        MessageServicesClient.sendReadMessage(chat_id, user_id);
    }, []);

    useEffect(() => {
        MessageServicesClient.sendReadMessage(chat_id, user_id);
    }, [user_id]);

    return (
        <MainContainer>
            <ChatMessages messages={messages} user={loggedUser} connected={connected} sender={user_id} receiver={receiverID} chat={chat_id} />
        </MainContainer>
        
    );
};
