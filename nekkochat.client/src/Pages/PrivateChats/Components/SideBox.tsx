import { Sidebar, ConversationList, Conversation, Avatar } from '@chatscope/chat-ui-kit-react';
import ProfileHeader from "../../Shared/ProfileHeader";
import { iConversationClusterProps, iSideBoxProps } from "../../../Constants/Types/CommonTypes";
import MessageServicesClient from "../../../Utils/MessageServicesClient";
import FirstLetterUpperCase from '../../../Utils/FirstLetterUpperCase';
import { ListItemIcon, ListItemText, Menu, MenuItem } from '@mui/material';
import { Archive, Delete, Favorite } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import GetUserStatusService from '../../../Utils/GetUserStatusService';
import useGetParticipants from '../../../Hooks/useGetParticipants';
import useGetReceiver from '../../../Hooks/useGetReceiver';
import ConversationSkeleton from '../../Shared/Skeletons/ConversationSkeleton';
import ProfileHeaderSkeleton from '../../Shared/Skeletons/ProfileHeaderSkeleton';
import avatar from "../../../assets/avatar.png";
import { useAppDispatch } from '../../../Hooks/storeHooks';
import { toggleErrorModal, toggleMsjModal } from '../../../Store/Slices/userSlice';
export default function SideBox({
    messages,
    user,
    setCurrentConversation,
    trigger,
    DisplayMessage }: iSideBoxProps) {

    const { getUnreadMessages } = useGetReceiver(user, DisplayMessage);

    const { getParticipantName, getPic } = useGetParticipants(user);

    const [data, setData] = useState<iConversationClusterProps[]>([]);

    const [chat_id, setChat_id] = useState<number>();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const dispatch = useAppDispatch();

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

    const refresh = () => {
        if (messages.length > 0) {
            setData([...messages]);
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            refresh();
        }
    }, [messages]);

    return (
        <Sidebar position="left" scrollable={false} style={{ minHeight: "100vh" }}>

            {user ? <ProfileHeader item={messages} func={setData} refresh={refresh} category="Chats" key={1} /> : <ProfileHeaderSkeleton />}

            {data && data.length > 0 ?
                <ConversationList>
                    {data.map((el: iConversationClusterProps, idx: number) => {
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
                                setCurrentConversation(parseInt(el._id));
                                await MessageServicesClient.sendReadMessage({
                                    chat_id: parseInt(el._id || "0"),
                                    user_id: user,
                                    sender_id: user,
                                });
                                await trigger();
                            }}>
                            <Avatar
                                src={getPic(el.participants) || avatar}
                                name={el.participants[el.participants.length - 1].name}
                                status={GetUserStatusService(parseInt(el!.status || "0"))} />
                        </Conversation>);
                    })}
                </ConversationList>
                :
                <ConversationSkeleton />}

            {data && data.length > 0 &&
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
                        const res = await MessageServicesClient.manageChat({
                            operation: "archive",
                            chat_id,
                            user_id: user,
                            sender_id: user,
                            archive: true
                        });
                        if (res.success) {
                            dispatch(toggleMsjModal({ status: true, message: res.message }));
                            await trigger();
                        } else {
                            dispatch(toggleErrorModal({ status: true, message: res.message }));
                        }                    }}>
                        <ListItemIcon>
                            <Archive fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Archive</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={async () => {
                        handleClose();
                        const res = await MessageServicesClient.manageChat({
                            operation: "favorite",
                            chat_id,
                            user_id: user,
                            sender_id: user,
                            favorite: true
                        });
                        if (res.success) {
                            dispatch(toggleMsjModal({ status: true, message: res.message }));
                            await trigger();
                        } else {
                            dispatch(toggleErrorModal({ status: true, message: res.message }));
                        }                    }}>
                        <ListItemIcon>
                            <Favorite fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Favorite</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={async () => {
                        handleClose();
                        const res = await MessageServicesClient.deleteUserChat({
                            chat_id,
                            user_id: user,
                            sender_id: user,
                        });
                        if (res.success) {
                            dispatch(toggleMsjModal({ status: true, message: res.message }));
                            await trigger();
                        } else {
                            dispatch(toggleErrorModal({ status: true, message: res.message }));
                        }
                    }}>
                        <ListItemIcon>
                            <Delete fontSize="small" />
                        </ListItemIcon>
                        <ListItemText>Delete</ListItemText>
                    </MenuItem>

                </Menu>}
        </Sidebar>
    );
}
