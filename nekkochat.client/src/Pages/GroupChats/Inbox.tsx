import "./Inbox.css";
import { MainContainer } from '@chatscope/chat-ui-kit-react';

import { useState, useEffect } from "react";

import SideBox from "./Components/SideBox";
import ChatMessages from "./Components/ChatMessages";

import ChatSchema from "../../Schemas/ChatSchema";

import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";
import useSignalServer from "../../Hooks/useSignalServer";
import useGetGroupsFromUser from "../../Hooks/Group/useGetGroupsFromUser";
import useGetUser from "../../Hooks/Group/useGetUser";

import { getUserData } from "../../Store/Slices/userSlice";
import NekkoNavbar from "../Shared/NekkoNavbar";
export default function Inbox() {

    const [isTyping, setIsTyping] = useState({typing:false, user_id: "0", username: "Member"});

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const addToChat = (user: string, username:string, msj: string, { typing, user_id, userN}:any) => {
        if (!msj && !user) {
            setIsTyping({ typing: typing, user_id: user_id, username: userN });
            setTimeout(() => {
                setIsTyping({ typing: false, user_id: user_id, username: userN });
            }, 3000);
            return;
        }
        setMessages((c: any) =>
            [...c, new ChatSchema(Math.floor(Math.random()).toString(), user, username, msj, new Date().toJSON(), false)]);
    };

    const { conversations, loggedUser, user_id } = useGetUser(user);
    const { connected } = useSignalServer(loggedUser, addToChat);
    const { messages, setMessages, chatID,  fetchMessage } = useGetGroupsFromUser();

    useEffect(() => {
        dispatch(getUserData());
    }, []);
    
    return (

        <>
            <NekkoNavbar user={user_id}  />
            <MainContainer >
                <SideBox messages={conversations} user={user_id} setCurrentConversation={fetchMessage} />
                <ChatMessages
                    messages={messages}
                    connected={connected}
                    sender={user_id}
                    receiver={chatID}
                    isTyping={isTyping}
                />
            </MainContainer>
        </>
        
    );
}
