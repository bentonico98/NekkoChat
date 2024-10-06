import { ChatContainer, MessageList, Message, MessageInput, Avatar, Button, ConversationHeader, VoiceCallButton, VideoCallButton, EllipsisButton, TypingIndicator, MessageSeparator } from '@chatscope/chat-ui-kit-react';

import avatar from "../../../assets/avatar.png";

import ChatSchema from "../../../Schemas/ChatSchema";

import MessageServicesClient from "../../../Utils/MessageServicesClient";
import GroupChatsServerServices from "../../../Utils/GroupChatsServerServices";

import useGetGroup from "../../../Hooks/Group/useGetGroup";
import { useNavigate } from 'react-router-dom';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMaximize } from "@fortawesome/free-solid-svg-icons";


export default function ChatMessages({ messages, connected, sender, receiver, isTyping }: any) {

    const { groupName, groupType, groupDesc, groupPhoto, startDate } = useGetGroup(sender, messages, receiver);

    const navigate = useNavigate();
  

    return (
        <>
            {messages.length > 0 ?

                <ChatContainer className="flexibleContainer">

                    {/*Chat Header*/}

                    <ConversationHeader>
                        <ConversationHeader.Back onClick={() => { navigate(-1); }} />
                        <Avatar src={avatar} name={groupName.toLocaleUpperCase()} />
                        <ConversationHeader.Content userName={groupName.toLocaleUpperCase()}  />
                        <ConversationHeader.Actions>
                            <VoiceCallButton />
                            <VideoCallButton />
                            <Button icon={<FontAwesomeIcon icon={faMaximize} />} onClick={() => { navigate("/groupchats/chat/" + receiver); }} />
                            <EllipsisButton orientation="vertical" />
                        </ConversationHeader.Actions>
                    </ConversationHeader>

                    {/*Chat Component*/}

                    <MessageList typingIndicator={isTyping && isTyping.typing && isTyping.user_id !== sender && <TypingIndicator content={`${isTyping.username} is typing`} />}>
                        <MessageSeparator content={startDate} />
                        {messages.map((el: ChatSchema, idx: number) => {
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
                        onSend={async (e) => { await MessageServicesClient.sendMessageToGroup(receiver, sender, groupName, groupType,groupDesc,groupPhoto, e) }} />
                </ChatContainer>
                : <ChatContainer className="flexibleContainer">
                    <div>NekkoChat</div>
                </ChatContainer>}
        </>
    );
}

