import { ChatContainer, MessageList, Message, MessageInput, Avatar, Button, ConversationHeader, VoiceCallButton, VideoCallButton, EllipsisButton, TypingIndicator, MessageSeparator } from '@chatscope/chat-ui-kit-react';

import avatar from "../../../assets/avatar.png";

import MessageServicesClient from "../../../Utils/MessageServicesClient";
import GroupChatsServerServices from "../../../Utils/GroupChatsServerServices";

import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize } from "@fortawesome/free-solid-svg-icons";
import { iChatSchema, iGroupChatMessagesProps } from '../../../Constants/Types/CommonTypes';
import FirstLetterUpperCase from '../../../Utils/FirstLetterUpperCase';
import { Container } from '@mui/material';
import useGetGroup from '../../../Hooks/Group/useGetGroup';


export default function ChatMessages({
    messages,
    connected,
    sender,
    receiver,
    isTyping,
    DisplayMessage
}: iGroupChatMessagesProps) {

    const {
        groupName,
        groupType,
        groupDesc,
        groupPhoto,
        startDate } = useGetGroup(sender, messages, receiver, DisplayMessage);

    const navigate = useNavigate();

    return (
        <>
            {messages.length > 0 ?
                <ChatContainer className="flexibleContainer">

                    {/*Chat Header*/}

                    <ConversationHeader>
                        <ConversationHeader.Back onClick={() => { navigate(-1); }} />
                        <Avatar
                            src={groupPhoto || avatar}
                            name={FirstLetterUpperCase(groupName)} />
                        <ConversationHeader.Content userName={FirstLetterUpperCase(groupName)} />
                        <ConversationHeader.Actions>
                            <VoiceCallButton />
                            <VideoCallButton />
                            <Button
                                icon={<FontAwesomeIcon icon={faMaximize} />}
                                onClick={() => { navigate("/groupchats/chat/" + receiver); }} />
                            <EllipsisButton orientation="vertical" />
                        </ConversationHeader.Actions>
                    </ConversationHeader>

                    {/*Chat Component*/}

                    <MessageList typingIndicator={isTyping && isTyping.typing && isTyping.user_id !== sender && <TypingIndicator content={`${isTyping.username} is typing`} />}>
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
                                    <Avatar src={avatar} name={el.username} />
                                    <Message.Header sender={el.username} />
                                    <Message.Footer sentTime={el.created_at} />
                                </Message>
                            );
                        })}
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
                                GroupChatsServerServices.SendTypingSignal(sender, receiver);
                            } else {
                                return;
                            }
                        }}
                        onSend={async (e) => {
                            await MessageServicesClient.sendMessageToGroup({
                                group_id: receiver,
                                sender_id: sender,
                                groupname: groupName,
                                grouptype: groupType,
                                groupdesc: groupDesc,
                                groupphoto: groupPhoto,
                                value: e
                            })
                        }} />
                </ChatContainer>
                : <Container style={{ minHeight: "100vh" }}>
                        <h1>NekkoChat</h1>
                </Container>}
        </>
    );
}

