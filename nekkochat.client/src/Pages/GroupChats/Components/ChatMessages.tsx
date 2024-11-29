import { ChatContainer, MessageList, Message, MessageInput, Avatar, ConversationHeader, AddUserButton , EllipsisButton, TypingIndicator, MessageSeparator } from '@chatscope/chat-ui-kit-react';

import avatar from "../../../assets/avatar.png";

import MessageServicesClient from "../../../Utils/MessageServicesClient";
import GroupChatsServerServices from "../../../Utils/GroupChatsServerServices";

import { useNavigate } from 'react-router-dom';

import { iChatSchema, iGroupChatMessagesProps, iuserStore } from '../../../Constants/Types/CommonTypes';
import FirstLetterUpperCase from '../../../Utils/FirstLetterUpperCase';
import useGetGroup from '../../../Hooks/Group/useGetGroup';
import { openUserProfileModal, setProfileId, toggleErrorModal, toggleMsjModal, UserState } from '../../../Store/Slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../../Hooks/storeHooks';
import useGetParticipants from '../../../Hooks/useGetParticipants';
import NekkoSpinner from '../../Shared/Skeletons/NekkoSpinner';
import Modal from "react-modal";
import customStyles from '../../../Constants/Styles/ModalStyles';
import GroupManagerAlt from '../../Shared/Forms/GroupManagerAlt';
import { useState } from 'react';
import {  ListItemIcon, ListItemText, Menu, MenuItem } from "@mui/material";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
export default function ChatMessages({
    messages,
    connected,
    sender,
    receiver,
    participants,
    isTyping,
    DisplayMessage
}: iGroupChatMessagesProps) {

    const user: UserState | iuserStore | any = useAppSelector((state)=> state.user)
    const dispatch = useAppDispatch();

    const {
        groupName,
        groupType,
        groupDesc,
        groupPhoto,
        startDate } = useGetGroup(sender, messages, receiver, DisplayMessage);

    const { getGroupPic } = useGetParticipants(user.value.id);

    const navigate = useNavigate();

    const [modalOpened, setModalOpened] = useState<boolean>(false);

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const openAnchor = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    function open() {
        setModalOpened(true);
    }
    function afterOpenModal() {
        // references are now sync'd and can be accessed.
        // subtitle.style.color = '#f00';
    }
    function close() {
        setModalOpened(false);
    }

    const handleInfoButton = (id: string | undefined) => {
        if (!id) return;
        dispatch(setProfileId(id));
        dispatch(openUserProfileModal());
    }

    return (
        <>
            {messages.length > 0 ?
                <ChatContainer >
                    {/*Chat Header*/}
                    <ConversationHeader>
                        <Avatar
                            src={groupPhoto || avatar}
                            name={FirstLetterUpperCase(groupName)}
                            onClick={() => { navigate("/group/" + receiver); }} />
                        <ConversationHeader.Content userName={FirstLetterUpperCase(groupName)} />
                        <ConversationHeader.Actions>
                            <AddUserButton onClick={open} />
                            <EllipsisButton
                                orientation="vertical"
                                onClick={handleClick} />
                            <Menu
                                id="basic-menu"
                                anchorEl={anchorEl}
                                open={openAnchor}
                                onClose={handleClose}
                                MenuListProps={{
                                    'aria-labelledby': 'basic-button',
                                }}
                            >
                                <MenuItem onClick={async () => {
                                    handleClose();
                                    const res = await MessageServicesClient.deleteUserChat({
                                        chat_id: receiver,
                                        sender_id: sender
                                    });
                                    if (res.success) {
                                        dispatch(toggleMsjModal({ status: true, message: res.message }));
                                    } else {
                                        dispatch(toggleErrorModal({ status: true, message: res.error }));
                                    }
                                }}>
                                    <ListItemIcon>
                                        <ExitToAppIcon fontSize="small" />
                                    </ListItemIcon>
                                    <ListItemText>Leave Group</ListItemText>
                                </MenuItem>

                            </Menu>
                        </ConversationHeader.Actions>
                    </ConversationHeader>

                    {/*Chat Component*/}

                    <MessageList
                        style={{ height: '100vh' }}
                        autoScrollToBottom={true}
                        autoScrollToBottomOnMount={true}
                        scrollBehavior="smooth"
                        typingIndicator={isTyping &&
                            isTyping.typing &&
                            isTyping.user_id !== sender &&
                            isTyping.group_id == receiver.toString() &&
                            <TypingIndicator content={`${isTyping.username} is typing`} />}>
                        <MessageSeparator content={startDate} />
                        {messages.map((el: iChatSchema, idx: number) => {
                            return (
                                <Message key={idx} model={{
                                    message: `${el.content}`,
                                    sentTime: `${el.created_at}`,
                                    sender: `${el.username}`,
                                    direction: `${el.user_id === sender ? "outgoing" : "incoming"}`,
                                    position: "single"
                                }}>
                                    <Avatar src={getGroupPic(participants, el.user_id)} onClick={() => { handleInfoButton(el.user_id) } } name={el.username} />
                                    <Message.Header sender={el.username} />
                                    <Message.Footer sentTime={el.created_at} />
                                </Message>
                            );
                        })}
                    </MessageList>

                    {/*Box to Send Message*/}

                    <MessageInput
                        style={{ textAlign: 'right' }}
                        className="textBoxInput text-right"
                        placeholder="Type message here"
                        disabled={!connected}
                        sendOnReturnDisabled={!connected}
                        sendDisabled={!connected}
                        onChange={(e) => {
                            if (e.length > 1) {
                                GroupChatsServerServices.SendTypingSignal(sender, receiver);
                            } else {
                                return;
                            }
                        }}
                        onSend={async (e) => {
                            const res = await MessageServicesClient.sendMessageToGroup({
                                group_id: receiver,
                                sender_id: sender,
                                user_id: sender,
                                groupname: groupName,
                                grouptype: groupType,
                                groupdesc: groupDesc,
                                groupphoto: groupPhoto,
                                value: e,
                                participants: [{ id: "0", name: "None", connectionid: "00000000", profilePic: "/src/assets/avatar.png" }]
                            });
                            if (!res.success) {
                                dispatch(toggleErrorModal({ status: true, message: "Unable To Send Message."}))
                            }
                        }} />
                </ChatContainer> : <NekkoSpinner />}

            <Modal
                isOpen={modalOpened}
                onAfterOpen={afterOpenModal}
                onRequestClose={close}
                style={customStyles}
                contentLabel="Group Modal"
            >
                <GroupManagerAlt
                    groupname={groupName}
                    groupdesc={groupDesc}
                    groupphoto={groupPhoto}
                    grouptype={groupType}
                    participants={participants}
                    group_id={receiver}
                />
            </Modal>
        </>
    );
}

