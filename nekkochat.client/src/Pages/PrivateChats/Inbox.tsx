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

import { closeModal, getUserData } from "../../Store/Slices/userSlice";

import Modal from "react-modal";
import customStyles from "../../Constants/Styles/ModalStyles";
import PrivateChatManager from "../Shared/Forms/PrivateChatManager";
import { useSearchParams } from "react-router-dom";
import { iChatSchema, iTypingComponentProps } from "../../Constants/Types/CommonTypes";
export default function Inbox() {

    const [isTyping, setIsTyping] = useState<iTypingComponentProps>({ typing: false, user_id: "0" });

    const [searchParams] = useSearchParams();
    const [typeParams] = useState(searchParams.get("type") || "all");

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const modalOpened = useAppSelector(state => state.user.modalOpened);
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }
    function close() {
        dispatch(closeModal());
    }

    const addToChat = (user: string, msj: string, { typing, user_id }: iTypingComponentProps) => {
        if (!msj && !user) {
            setIsTyping({ typing: typing, user_id: user_id });
            setTimeout(() => {
                setIsTyping({ typing: false, user_id: user_id });
            }, 3000);
            return;
        }
        setMessages((c: iChatSchema[]) =>
            [...c, new ChatSchema(Math.floor(Math.random()).toString(), user, user, msj, new Date().toJSON(), false)]);
    };

    useEffect(() => {
        dispatch(getUserData());
    }, []);

    const { conversations, loggedUser, user_id } = useGetUser(user, typeParams);
    const { connected } = useSignalServer(loggedUser, addToChat);
    const { messages, setMessages, currentConvo, chatID, receiverID, fetchMessage } = useGetChatFromUser(user_id);

    return (
        <>
            <MainContainer>
                <SideBox
                    messages={conversations}
                    user={user_id}
                    setCurrentConversation={fetchMessage} />

                {currentConvo.length > 0 && <ChatMessages
                    messages={messages}
                    participants={currentConvo[0].participants}
                    connected={connected}
                    sender={user_id}
                    receiver={receiverID}
                    chat={chatID}
                    isTyping={isTyping}
                />}
            </MainContainer>
            <Modal
                isOpen={modalOpened}
                onAfterOpen={afterOpenModal}
                onRequestClose={close}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <PrivateChatManager/>
            </Modal>
        </>
        
    );
}