import "./Inbox.css";
import { MainContainer } from '@chatscope/chat-ui-kit-react';

import { useState, useEffect } from "react";

import SideBox from "./Components/SideBox";
import ChatMessages from "./Components/ChatMessages";

import ChatSchema from "../../Schemas/ChatSchema";

import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";
import useSignalServer from "../../Hooks/useSignalServer";
import useGetChatFromUser from "../../Hooks/useGetChatFromUser";
import useGetUser from "../../Hooks/useGetUser";

import { getUserData } from "../../Store/Slices/userSlice";
import NekkoNavbar from "../Shared/NekkoNavbar";

export default function Inbox() {

    const [isTyping, setIsTyping] = useState({typing:false, user_id: "0"});

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const addToChat = (user: string, msj: string, { typing, user_id}:any) => {
        if (!msj && !user) {
            setIsTyping({ typing: typing, user_id: user_id });
            setTimeout(() => {
                setIsTyping({ typing: false, user_id: user_id });
            }, 3000);
            return;
        }
        setMessages((c: any) =>
            [...c, new ChatSchema(Math.floor(Math.random()).toString(), user, user, msj, new Date().toJSON(), false)]);
    };
    
    const { conversations, loggedUser, user_id} = useGetUser(user);
    const { connected } = useSignalServer(loggedUser, addToChat);
    const { messages, setMessages, chatID, receiverID, fetchMessage } = useGetChatFromUser(user_id);

    useEffect(() => {
        dispatch(getUserData());
    }, []);
    
    return (

        <>
            <NekkoNavbar user={user_id} />
            <MainContainer >
                <SideBox messages={conversations} user={user_id} setCurrentConversation={fetchMessage} />
                <ChatMessages
                    messages={messages}
                    user={loggedUser}
                    connected={connected}
                    sender={user_id}
                    receiver={receiverID}
                    chat={chatID}
                    isTyping={isTyping}
                />
            </MainContainer>
        </>
        
    );
}