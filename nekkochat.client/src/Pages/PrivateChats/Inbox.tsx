import { MainContainer } from '@chatscope/chat-ui-kit-react';

import { useState, useEffect } from "react";

import SideBox from "./Components/SideBox";
import ChatMessages from "./Components/ChatMessages";

import ChatSchema from "../../Schemas/ChatSchema";

import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";

import { getUserData, toggleErrorModal, toggleLoading, toggleMsjModal, toggleNotification } from "../../Store/Slices/userSlice";

import { useLocation, useSearchParams } from "react-router-dom";
import { iChatSchema, iTypingComponentProps } from "../../Constants/Types/CommonTypes";
import useGetUser from "../../Hooks/useGetUser";
import useSignalServer from "../../Hooks/useSignalServer";
import useGetChatFromUser from "../../Hooks/useGetChatFromUser";
import useDisplayMessage from "../../Hooks/useDisplayMessage";

import nekkoAlt from "../../assets/nekkoAlt.png";
import { Box, Stack, Typography } from '@mui/material';

export default function Inbox() {

    const { state } = useLocation();

    const [isTyping, setIsTyping] = useState<iTypingComponentProps>({
        typing: false,
        user_id: "0"
    });

    const [searchParams] = useSearchParams();
    const [typeParams] = useState(searchParams.get("type") || "all");

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
            [...c, new ChatSchema(
                Math.floor(Math.random()).toString(),
                user,
                user,
                msj,
                new Date().toJSON(),
                false)]);
    };

    useEffect(() => {
        dispatch(getUserData());
        if (state) {
            fetchMessage(state.id);
        }
    }, []);

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

    const {
        conversations,
        loggedUser,
        user_id
    } = useGetUser(user, typeParams, setDisplayInfo);

    const { connected } = useSignalServer(loggedUser, addToChat, setDisplayInfo);

    const {
        messages,
        setMessages,
        currentConvo,
        chatID,
        receiverID,
        fetchMessage
    } = useGetChatFromUser(user_id, setDisplayInfo);

    return (
        <>
            <MainContainer style={{overflowY:'hidden'} }>
                <SideBox
                    messages={conversations}
                    user={user_id}
                    setCurrentConversation={fetchMessage}
                    DisplayMessage={setDisplayInfo} />

                {messages.length > 0 ? <ChatMessages
                    messages={messages}
                    participants={currentConvo[0].participants}
                    connected={connected}
                    sender={user_id}
                    receiver={receiverID}
                    chat={chatID}
                    isTyping={isTyping}
                    DisplayMessage={setDisplayInfo}
                /> : <Box style={{ minWidth: "70%", display: 'flex', alignItems: 'center', justifyContent: "center" }}>
                    <Box>
                        <Stack direction='column' spacing={2} className="text-left p-3" sx={{ alignItems: "center", justifyContent: 'center' }}>
                            <img
                                alt=""
                                src={nekkoAlt}
                                width="300"
                                height="300"
                                className="d-inline-block align-top"
                            />

                        </Stack>
                        <Typography className="text-muted" variant="body1" >Send and receive messages to your fellow cat lovers.</Typography>
                        <Typography className="text-muted" variant="body1" >Add your favorite your fellow cat lovers as friend.</Typography>
                    </Box>
                </Box>}
            </MainContainer>
        </>

    );
}