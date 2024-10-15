import "../Inbox.css";
import { useState } from "react";
import { Conversation, Avatar } from '@chatscope/chat-ui-kit-react';
import avatar from "../../../assets/avatar.png";
import useGetReceiver from "../../../Hooks/useGetReceiver";
import MessageServicesClient from "../../../Utils/MessageServicesClient";

export default function SideBoxCard({ chat, user, setCurrentConversation }: any) {

    const [participants] = useState<any>([...chat.participants]);
    const [messages] = useState<any>([...chat.messages]);
    const { receiverName, unreadMsj, receiverStatus } = useGetReceiver(user, messages);

    return (
        <Conversation
            key={chat._id}
            name={receiverName.toUpperCase()}
            lastSenderName={participants[participants.length - 1].name}
            info={messages[messages.length - 1].content}
            unreadCnt={unreadMsj}
            onClick={async () => {
                setCurrentConversation(chat._id);
                await MessageServicesClient.sendReadMessage(chat._id, user);
            }}>
            <Avatar
                src={avatar}
                name={participants[participants.length - 1].name}
                status={receiverStatus} />
        </Conversation>
    );
}
