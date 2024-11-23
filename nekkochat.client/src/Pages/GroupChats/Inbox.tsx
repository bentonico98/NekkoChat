import { MainContainer } from '@chatscope/chat-ui-kit-react';

import { useState, useEffect } from "react";

import SideBox from "./Components/SideBox";
import ChatMessages from "./Components/ChatMessages";

//import ChatSchema from "../../Schemas/ChatSchema";

import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";

import { getUserData,  toggleErrorModal, toggleMsjModal, toggleNotification, toggleLoading } from "../../Store/Slices/userSlice";

import Modal from "react-modal";
import { iChatSchema, iTypingComponentProps } from "../../Constants/Types/CommonTypes";
import useGetUser from "../../Hooks/Group/useGetUser";
import useSignalServer from "../../Hooks/Group/useSignalServer";
import useGetGroupsFromUser from "../../Hooks/Group/useGetGroupsFromUser";
import useDisplayMessage from "../../Hooks/useDisplayMessage";
import { Box, Stack, Typography } from '@mui/material';

import nekkoAlt from "../../assets/nekkoAlt.png";

Modal.setAppElement("#root");
export default function Inbox() {
    const [isTyping, setIsTyping] = useState<iTypingComponentProps>({
        typing: false,
        user_id: "0",
        username: "Member",
        group_id: "0"
    });

    const user = useAppSelector((state) => state.user);
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

    const addToChat = (user: string, userN: string, msj: string, { typing, user_id, username }: iTypingComponentProps, groupID: string, groupName: string) => {
        if (!msj && !user) {
            setIsTyping({ typing: typing, user_id: user_id, username, group_id: groupID, groupname: groupName });
            setTimeout(() => {
                setIsTyping({ typing: false, user_id: user_id, username, group_id: groupID, groupname: groupName });
            }, 3000);
            return;
        }
        setMessages((c: iChatSchema[]) => {
            let payload: iChatSchema[] = [...c];
            if (c[0].group_id == parseInt(groupID)) {
                payload = [...c, {
                    id: Math.floor(Math.random()).toString(),
                    user_id:user,
                    username: userN,
                    content: msj,
                    groupname: groupName,
                    group_id: parseInt(groupID),
                    read: false,
                    created_at: new Date().toJSON()
                }];
            }
            return payload;
        });
    };

    const {
        conversations,
        loggedUser,
        user_id } = useGetUser(user, setDisplayInfo);

    const { connected } = useSignalServer(loggedUser, addToChat, setDisplayInfo);

    const {
        messages,
        setMessages,
        currentConvo,
        chatID,
        fetchMessage } = useGetGroupsFromUser(setDisplayInfo);

    useEffect(() => {
        dispatch(getUserData());
    }, []);

    return (
        <>
            <MainContainer style={{ overflowY: 'hidden' }} >
                <SideBox
                    messages={conversations}
                    user={user_id}
                    setCurrentConversation={fetchMessage}
                    DisplayMessage={setDisplayInfo}
                />

                {messages.length > 0 ?
                    <ChatMessages
                        messages={messages}
                        connected={connected}
                        participants={currentConvo[0].participants}
                        sender={user_id}
                        receiver={chatID}
                        isTyping={isTyping}
                        DisplayMessage={setDisplayInfo}
                    /> :  <Box style={{  minWidth: "70%", display: 'flex', alignItems: 'center', justifyContent: "center" }}>
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
                        <Typography className="text-muted" variant="body1" >Create groups.</Typography>
                        <Typography className="text-muted" variant="body1" >Enter your favorite groups.</Typography>
                        <Typography className="text-muted" variant="body1" >Up to 200 members allowed per group.</Typography>
                    </Box>
                </Box>}

            </MainContainer>
        </>

    );
}
