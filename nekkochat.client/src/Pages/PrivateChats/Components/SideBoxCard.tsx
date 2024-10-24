import "../Inbox.css";
import { useState } from "react";
import { Conversation, Avatar } from '@chatscope/chat-ui-kit-react';
import avatar from "../../../assets/avatar.png";
import useGetReceiver from "../../../Hooks/useGetReceiver";
import MessageServicesClient from "../../../Utils/MessageServicesClient";
import { iChatSchema, iparticipants, iSideBoxCardProps } from "../../../Constants/Types/CommonTypes";
import useGetParticipants from "../../../Hooks/useGetParticipants";
import { ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import { Archive, Delete, Favorite } from "@mui/icons-material";
import FirstLetterUpperCase from "../../../Utils/FirstLetterUpperCase";

export default function SideBoxCard({ chat, user, setCurrentConversation }: iSideBoxCardProps) {

    const [participants] = useState<iparticipants[]>([...chat.participants]);
    const [messages] = useState<iChatSchema[]>([...chat.messages]);
    const { unreadMsj, receiverStatus } = useGetReceiver(user, messages);
    const { participantName } = useGetParticipants(chat.participants, user);

    const [chat_id, setChat_id] = useState<number>(parseInt(chat._id));

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const open = Boolean(anchorEl);

    const handleSetInfo = (chatId: number) => {
        setChat_id(chatId);
    }

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
            <Conversation
                key={chat._id}
                name={FirstLetterUpperCase(participantName)}
                lastSenderName={messages[messages.length - 1].username}
                info={messages[messages.length - 1].content}
                unreadCnt={unreadMsj}
                onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
                    handleSetInfo(chat_id);
                    handleClick(e);
                }}
                onClick={async () => {
                    setCurrentConversation(chat._id);
                    await MessageServicesClient.sendReadMessage(chat._id, user);
                }}>
                <Avatar
                    src={avatar}
                    name={participants[participants.length - 1].name}
                    status={receiverStatus} />

            </Conversation>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                anchorOrigin={{ horizontal: 'center', vertical: "center" }}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem onClick={async () => {
                    handleClose();
                    await MessageServicesClient.manageChat("archive", chat_id, user, true);
                }}>
                    <ListItemIcon>
                        <Archive fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Archive</ListItemText>
                </MenuItem>
                <MenuItem onClick={async () => {
                    handleClose();
                    await MessageServicesClient.manageChat("favorite", chat_id, user, true);

                }}>
                    <ListItemIcon>
                        <Favorite fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Favorite</ListItemText>
                </MenuItem>
                <MenuItem onClick={async () => {
                    handleClose();
                    await MessageServicesClient.deleteUserChat(chat_id, user);
                }}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>

            </Menu>
        </>

    );
}
