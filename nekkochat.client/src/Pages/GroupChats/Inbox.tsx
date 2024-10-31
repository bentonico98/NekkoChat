import "./Inbox.css";
import { MainContainer } from '@chatscope/chat-ui-kit-react';

import { useState, useEffect } from "react";

import SideBox from "./Components/SideBox";
import ChatMessages from "./Components/ChatMessages";

import ChatSchema from "../../Schemas/ChatSchema";

import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";


import { getUserData, closeModal, toggleErrorModal, toggleMsjModal, toggleNotification, toggleLoading } from "../../Store/Slices/userSlice";

import Modal from "react-modal";
import customStyles from "../../Constants/Styles/ModalStyles";
import GroupManager from "../Shared/Forms/GroupManager";
import { iChatSchema, iTypingComponentProps } from "../../Constants/Types/CommonTypes";
import useGetUser from "../../Hooks/Group/useGetUser";
import useSignalServer from "../../Hooks/Group/useSignalServer";
import useGetGroupsFromUser from "../../Hooks/Group/useGetGroupsFromUser";
import useDisplayMessage from "../../Hooks/useDisplayMessage";
import RegularSkeleton from "../Shared/Skeletons/RegularSkeleton";

Modal.setAppElement("#root");
export default function Inbox() {
    const [isTyping, setIsTyping] = useState<iTypingComponentProps>({
        typing: false,
        user_id: "0",
        username: "Member"
    });

    const user = useAppSelector((state) => state.user);
    const modalOpened = useAppSelector(state => state.user.modalOpened);
    const dispatch = useAppDispatch();

    const { displayInfo, setDisplayInfo } = useDisplayMessage();

    useEffect(() => {
        if (displayInfo.hasError) {
            dispatch(toggleErrorModal({ status: true, message: displayInfo.error }));
        }
        if (displayInfo.hasMsj) {
            dispatch(toggleMsjModal({ status: true, message: displayInfo.msj }));
        }
        if (displayInfo.hasNotification) {
            dispatch(toggleNotification({ status: true, message: displayInfo.notification }));
        }
        dispatch(toggleLoading(displayInfo.isLoading));

    }, [displayInfo]);
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }

    function close() {
        dispatch(closeModal());
    }

    const addToChat = (user: string, username: string, msj: string, { typing, user_id, username: userN }: iTypingComponentProps) => {
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

    const {
        conversations,
        loggedUser,
        user_id } = useGetUser(user, setDisplayInfo);

    const { connected } = useSignalServer(loggedUser, addToChat, setDisplayInfo);

    const {
        messages,
        setMessages,
        chatID,
        fetchMessage } = useGetGroupsFromUser(setDisplayInfo);

    useEffect(() => {
        dispatch(getUserData());
    }, []);

    return (
        <>
            <MainContainer  >
                <SideBox
                    messages={conversations}
                    user={user_id}
                    setCurrentConversation={fetchMessage}
                    DisplayMessage={setDisplayInfo}
                />
                {messages.length > 0 &&
                    <ChatMessages
                        messages={messages}
                        connected={connected}
                        sender={user_id}
                        receiver={chatID}
                        isTyping={isTyping}
                        DisplayMessage={setDisplayInfo}
                    />}

            </MainContainer>
            <Modal
                isOpen={modalOpened}
                onAfterOpen={afterOpenModal}
                onRequestClose={close}
                style={customStyles}
                contentLabel="Example Modal"
            >
                <GroupManager />
            </Modal>
        </>

    );
}
