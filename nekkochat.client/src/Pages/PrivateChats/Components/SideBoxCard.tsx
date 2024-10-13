import "../Inbox.css";
import { useState } from "react";
import { Conversation, Avatar } from '@chatscope/chat-ui-kit-react';
import avatar from "../../../assets/avatar.png";
import useGetReceiver from "../../../Hooks/useGetReceiver";
import MessageServicesClient from "../../../Utils/MessageServicesClient";
import { iparticipants } from "../../../Constants/Types/CommonTypes";
import ChatSchema from "../../../Schemas/ChatSchema";
import useGetParticipants from "../../../Hooks/useGetParticipants";

export default function SideBoxCard({ chat, user, setCurrentConversation }: any) {

    const [participants] = useState<iparticipants[]>([...chat.participants]);
    const [messages] = useState<ChatSchema[]>([...chat.messages]);
    const { unreadMsj, receiverStatus } = useGetReceiver(user, messages );
    const { participantName } = useGetParticipants(chat.participants, user);

    return (
        <Conversation
            key={chat._id}
            name={participantName.toUpperCase()}
            lastSenderName={messages[messages.length - 1].username}
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
