import { ChatContainer, MessageList, Message, MessageInput, Avatar, ConversationHeader, VoiceCallButton, VideoCallButton, EllipsisButton, TypingIndicator, MessageSeparator } from '@chatscope/chat-ui-kit-react';
import avatar from "../../../assets/avatar.png";
import MessageServicesClient from "../../../Utils/MessageServicesClient";
import PrivateChatsServerServices from "../../../Utils/PrivateChatsServerServices";

import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Container, Divider, ListItemIcon, ListItemText, Menu, MenuItem, Typography } from "@mui/material";
import { ContentCut, ContentPaste, ContentCopy, Delete, Archive, Favorite } from "@mui/icons-material"
import { iChatMessagesProps, iChatSchema } from "../../../Constants/Types/CommonTypes";
import FirstLetterUpperCase from '../../../Utils/FirstLetterUpperCase';
import useGetReceiver from '../../../Hooks/useGetReceiver';
import useGetParticipants from '../../../Hooks/useGetParticipants';
export default function ChatMessages(
    {
        messages,
        connected,
        chat,
        sender,
        receiver,
        participants,
        isTyping,
        DisplayMessage
    }: iChatMessagesProps) {

    const { getReceiverName, getLastOnline, getChatStartDate } = useGetReceiver(sender, DisplayMessage);
    const { getParticipantName } = useGetParticipants(sender);

    const navigate = useNavigate();

    const [chat_id, setChat_id] = useState<number>(chat);
    const [message_id, setMessage_id] = useState<string>("0");

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [messageAnchor, setMessageAnchor] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);
    const messageAnchorOpened = Boolean(messageAnchor);

    const handleSetInfo = (chatId: number, messageId: string) => {
        setChat_id(chatId);
        setMessage_id(messageId);
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    const messageAnchorClickHandle = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setMessageAnchor(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
        setMessageAnchor(null);
    };

    const handleDeleteMessageButton = async (chat_id: number, message_id: string, user_id: string) => {
        if (!chat_id) return;
        if (!message_id) return;
        if (!user_id) return;

        DisplayMessage({ isLoading: true });

        const res = await MessageServicesClient.deleteMessageFromChat({ chat_id, message_id, user_id });

        if (res.success) {
            DisplayMessage({
                hasMsj: true,
                msj: "Deletion " + res.message,
                isLoading: false
            });
        } else {
            if (res.internalMessage) return DisplayMessage({
                hasError: true,
                error: res.internalMessage,
                isLoading: true
            });
            DisplayMessage({
                hasError: true,
                error: res.error,
                isLoading: true
            });
        }
    }

    return (
        <>
            {messages.length > 0 ?
                <ChatContainer style={{minHeight: "100vh"}}>

                    {/*Chat Header*/}

                    <ConversationHeader>
                        <ConversationHeader.Back onClick={() => { navigate(-1); }} />
                        <Avatar
                            src={avatar}
                            name={FirstLetterUpperCase(getParticipantName(participants))} />
                        <ConversationHeader.Content
                            userName={FirstLetterUpperCase(getParticipantName(participants))}
                            info={getLastOnline(messages)} />
                        <ConversationHeader.Actions>
                            <VoiceCallButton />
                            <VideoCallButton />
                            <EllipsisButton
                                orientation="vertical"
                                onClick={handleClick} />
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={async () => {
                                    handleClose();
                                    await MessageServicesClient.manageChat({
                                        operation: "archive",
                                        chat_id: chat,
                                        sender_id: sender,
                                        archive: true
                                    });
                                }}>
                                    <ListItemIcon>
                                        <Archive fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Archive</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={async () => {
                                    handleClose();
                                    await MessageServicesClient.manageChat({
                                        operation: "favorite",
                                        chat_id: chat,
                                        sender_id: sender,
                                        favorite: true
                                    });

                                }}>
                                    <ListItemIcon>
                                        <Favorite fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Favorite</ListItemText>
                                </MenuItem>
                                <MenuItem onClick={async () => {
                                    handleClose();
                                    await MessageServicesClient.deleteChat({
                                        chat_id: chat,
                                        message_id,
                                        sender_id: sender
                                    });
                                }}>
                                    <ListItemIcon>
                                        <Delete fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Delete</ListItemText>
                                </MenuItem>

                            </Menu>
                        </ConversationHeader.Actions>
                    </ConversationHeader>

                    {/*Chat Component*/}

                    <MessageList
                        typingIndicator={isTyping &&
                            isTyping.typing &&
                            isTyping.user_id === receiver &&
                            <TypingIndicator content={`${getReceiverName(messages)} is typing`} />}>
                        <MessageSeparator content={`${getChatStartDate(messages)}`} />
                        {messages.map((el: iChatSchema, idx: number) => {
                            return (
                                <Message key={idx} model={{
                                    message: `${el.content}`,
                                    sentTime: `${el.created_at}`,
                                    sender: `${el.username}`,
                                    direction: `${el.user_id === sender ? "outgoing" : "incoming"}`,
                                    position: "single"
                                }}
                                    onContextMenu={(e: React.MouseEvent<HTMLButtonElement>) => {
                                        messageAnchorClickHandle(e);
                                        handleSetInfo(chat, `${el.id}`);
                                    }}
                                >
                                    <Avatar src={avatar} name={el.username} />
                                </Message>
                            );
                        })}
                        {/* Popup Menu */}

                        <Menu
                            id="basic-menu"
                            anchorEl={messageAnchor}
                            open={messageAnchorOpened}
                            onClose={handleClose}
                            autoFocus={messageAnchorOpened}
                            slotProps={{
                                paper: {
                                    elevation: 0,
                                    sx: {
                                        overflow: 'visible',
                                        filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                                        mt: 1.5,
                                        '& .MuiAvatar-root': {
                                            width: 32,
                                            height: 32,
                                            ml: -0.5,
                                            mr: 1,
                                        },
                                        '&::before': {
                                            content: '""',
                                            display: 'block',
                                            position: 'absolute',
                                            top: 0,
                                            right: 14,
                                            width: 10,
                                            height: 10,
                                            bgcolor: 'background.paper',
                                            transform: 'translateY(-50%) rotate(45deg)',
                                            zIndex: 0,
                                        },
                                    },
                                },
                            }}
                            transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                            anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        >
                            <MenuItem>
                                <ListItemIcon>
                                    <ContentCut fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Cut</ListItemText>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    ⌘X
                                </Typography>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <ContentCopy fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Copy</ListItemText>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    ⌘C
                                </Typography>
                            </MenuItem>
                            <MenuItem>
                                <ListItemIcon>
                                    <ContentPaste fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Paste</ListItemText>
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    ⌘V
                                </Typography>
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={() => { handleDeleteMessageButton(chat_id, message_id, sender) }}>
                                <ListItemIcon>
                                    <Delete fontSize="small" />
                                </ListItemIcon>
                                <ListItemText>Delete</ListItemText>
                            </MenuItem>
                        </Menu>
                    </MessageList>

                    {/*Box to Send Message*/}

                    <MessageInput
                        className="textBoxInput"
                        placeholder="Type message here"
                        disabled={!connected}
                        sendOnReturnDisabled={!connected}
                        sendDisabled={!connected}
                        onChange={(e) => {
                            if (e.length > 1) {
                                PrivateChatsServerServices.SendTypingSignal({
                                    sender_id: sender,
                                    receiver_id: receiver.toString()
                                });
                            } else {
                                return;
                            }
                        }}
                        onSend={async (e) => {
                            await MessageServicesClient.sendMessageToUser({
                                chat_id: chat,
                                sender_id: sender,
                                receiver_id: receiver.toString(),
                                value: e
                            })
                        }} />
                </ChatContainer>
                : <Container style={{ minHeight: "100vh", zIndex: 90000 }}>
                    <h1>NekkoChat Privado</h1>
                </Container>}
        </>
    );
}
