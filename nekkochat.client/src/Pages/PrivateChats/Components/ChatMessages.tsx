import "../PrivateChats.css";
import ChatSchema from "../../../Schemas/ChatSchema";
import { ChatContainer, MessageList, Message, MessageInput, Avatar, ConversationHeader, VoiceCallButton, VideoCallButton, EllipsisButton, TypingIndicator, MessageSeparator } from '@chatscope/chat-ui-kit-react';
import avatar from "../../../assets/avatar.png";
import MessageServicesClient from "../../../Utils/MessageServicesClient";
import useGetReceiver from "../../../Hooks/useGetReceiver";
import PrivateChatsServerServices from "../../../Utils/PrivateChatsServerServices";



export default function ChatMessages({ messages, user, connected, chat, sender, receiver, isTyping }: any) {

    const { receiverName, lastOnline, startDate } = useGetReceiver(sender, messages);

    return (
        <>
            {messages.length > 0 ?

                <ChatContainer className="flexibleContainer">

                    {/*Chat Header*/}

                    <ConversationHeader>
                        <ConversationHeader.Back />
                        <Avatar src={avatar} name={receiverName.toLocaleUpperCase()} />
                        <ConversationHeader.Content userName={receiverName.toLocaleUpperCase()} info={lastOnline} />
                        <ConversationHeader.Actions>
                            <VoiceCallButton />
                            <VideoCallButton />
                            <EllipsisButton orientation="vertical" />
                        </ConversationHeader.Actions>
                    </ConversationHeader>

                    {/*Chat Component*/}

                    <MessageList typingIndicator={isTyping && isTyping.typing && isTyping.user_id === receiver && <TypingIndicator content={`${receiverName} is typing`} />}>
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
                                PrivateChatsServerServices.SendTypingSignal(sender, receiver);
                            } else {
                                return;
                            }
                        }}
                        onSend={async (e) => { await MessageServicesClient.sendMessageToUser(chat, sender, receiver, e) }} />
                </ChatContainer>
                : <ChatContainer className="flexibleContainer">
                    <div>NekkoChat</div>
                </ChatContainer>}
        </>
    );
}
