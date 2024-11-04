import { Sidebar, Search, ConversationList, Conversation, Avatar, UserStatus } from '@chatscope/chat-ui-kit-react';
import ProfileHeader from "../../Shared/ProfileHeader";
import { iConversationClusterProps, iSideBoxProps } from "../../../Constants/Types/CommonTypes";
import MessageServicesClient from "../../../Utils/MessageServicesClient";
import useGetReceiver from "../../../Hooks/useGetReceiver";
import avatar from "../../../assets/avatar.png";
import FirstLetterUpperCase from '../../../Utils/FirstLetterUpperCase';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Archive, Delete, Favorite } from '@mui/icons-material';
import { useState } from 'react';
import useGetParticipants from '../../../Hooks/useGetParticipants';
import GetUserStatusService from '../../../Utils/GetUserStatusService';

export default function SideBox({ messages, user, setCurrentConversation }: iSideBoxProps) {

    const { getUnreadMessages } = useGetReceiver(user);

    const { getParticipantName } = useGetParticipants(user);

    const [status] = useState<UserStatus>("unavailable");


    const [chat_id, setChat_id] = useState<number>();
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
        <Sidebar position="left" scrollable={false} style={{ minHeight: "100vh" }}>
            <ProfileHeader />
            <Search placeholder="Search..." />
            <ConversationList>
                {messages.map((el: iConversationClusterProps, idx: number) => {
                    return (<Conversation
                        key={idx}
                        name={FirstLetterUpperCase(getParticipantName(el.participants) || "Unknown")}
                        lastSenderName={el.messages[el.messages.length - 1].username}
                        info={el.messages[el.messages.length - 1].content}
                        unreadCnt={getUnreadMessages(el.messages)}
                        onContextMenu={(e: React.MouseEvent<HTMLDivElement>) => {
                            handleSetInfo(parseInt(el._id));
                            handleClick(e);
                        }}
                        onClick={async () => {
                            setCurrentConversation(el._id);
                            await MessageServicesClient.sendReadMessage({
                                chat_id: parseInt(el._id || "0"),
                                user_id: user,
                                sender_id: user,
                            });
                        }}>
                        <Avatar
                            src={avatar}
                            name={el.participants[el.participants.length - 1].name}
                            status={GetUserStatusService(parseInt(el!.status || "0"))} />
                    </Conversation>);
                })}
            </ConversationList>
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
                    await MessageServicesClient.manageChat({
                        operation: "archive",
                        chat_id,
                        user_id: user,
                        sender_id: user,
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
                        chat_id,
                        user_id: user,
                        sender_id: user,
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
                    await MessageServicesClient.deleteUserChat({
                        chat_id,
                        user_id: user,
                        sender_id: user,
                    });
                }}>
                    <ListItemIcon>
                        <Delete fontSize="small" />
                    </ListItemIcon>
                    <ListItemText>Delete</ListItemText>
                </MenuItem>

            </Menu>
        </Sidebar>
    );
}
