import "../Inbox.css";

import { useState } from "react";

import { Conversation, Avatar } from '@chatscope/chat-ui-kit-react';

import avatar from "../../../assets/avatar.png";

import useGetReceiver from "../../../Hooks/useGetReceiver";

import MessageServicesClient from "../../../Utils/MessageServicesClient";

export default function SideBoxCard({ chat, user, setCurrentConversation }: any) {

    const [participants] = useState<any>([...chat.participants]);
    const [groupname] = useState<string>(chat.groupname);
    const [messages] = useState<any>([...chat.messages]);
    const { unreadMsj } = useGetReceiver(user, messages);

    return (
        <Conversation
            key={chat._id}
            name={groupname}
            lastSenderName={messages[messages.length - 1].name}
            info={messages[messages.length - 1].content}
            unreadCnt={unreadMsj}
            onClick={async () => {
                setCurrentConversation(chat._id);
                await MessageServicesClient.sendReadMessageGroup(chat._id, user, groupname);
            }}>
            <Avatar
                src={avatar}
                name={participants[participants.length - 1].name}
            />
        </Conversation>
    );
}
