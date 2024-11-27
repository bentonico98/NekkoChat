import { ChatContainer, MessageList, Message, MessageInput, Avatar, ConversationHeader, AddUserButton , EllipsisButton, TypingIndicator, MessageSeparator } from '@chatscope/chat-ui-kit-react';

import avatar from "../../../assets/avatar.png";

import MessageServicesClient from "../../../Utils/MessageServicesClient";
import GroupChatsServerServices from "../../../Utils/GroupChatsServerServices";

import { useNavigate } from 'react-router-dom';

import { iChatSchema, iGroupChatMessagesProps, iuserStore } from '../../../Constants/Types/CommonTypes';
import FirstLetterUpperCase from '../../../Utils/FirstLetterUpperCase';
import useGetGroup from '../../../Hooks/Group/useGetGroup';
import { openUserProfileModal, setProfileId, UserState } from '../../../Store/Slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../../Hooks/storeHooks';
import useGetParticipants from '../../../Hooks/useGetParticipants';
import NekkoSpinner from '../../Shared/Skeletons/NekkoSpinner';
import Modal from "react-modal";
import customStyles from '../../../Constants/Styles/ModalStyles';
import GroupManagerAlt from '../../Shared/Forms/GroupManagerAlt';
import { useState } from 'react';

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
                <ChatContainer>
                    {/*Chat Header*/}
                    <ConversationHeader>
                        <Avatar
                            src={groupPhoto || avatar}
                            name={FirstLetterUpperCase(groupName)}
                            onClick={() => { navigate("/group/" + receiver); }} />
                        <ConversationHeader.Content userName={FirstLetterUpperCase(groupName)} />
                        <ConversationHeader.Actions>
                            <AddUserButton onClick={open} />
                            <EllipsisButton orientation="vertical" />
                        </ConversationHeader.Actions>
                    </ConversationHeader>

                    {/*Chat Component*/}

                    <MessageList
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
                                DisplayMessage({
                                    hasError: true,
                                    error: "Unable To Send Message."
                                });
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

