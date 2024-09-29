import "../Inbox.css";
import { useState } from "react";
import { Conversation, Avatar } from '@chatscope/chat-ui-kit-react';
import avatar from "../../../assets/avatar.png";
import useGetReceiver from "../../../Hooks/useGetReceiver";

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
            unreadCnt={unreadMsj} onClick={() => { setCurrentConversation(chat._id) }}>
            <Avatar src={avatar} name={participants[participants.length - 1].name} status={receiverStatus} />
        </Conversation>
    );
}

/**<Conversation name="Emily" lastSenderName="Emily" info="Yes i can do it for you" unreadCnt={3}>
                    <Avatar src={avatar} name="Emily" status="available" />
                </Conversation> 
                
                export default function SideBoxCard({ chat, setCurrentConversation }: any) {

    const [participants] = useState<any>([...chat.participants] );
    const [messages] = useState<any>([...chat.messages]);
    return (
        <button key={chat._id} onClick={() => { setCurrentConversation(chat._id) } }>
            <div>
                 <div className="sideboxHeadItems">
                    <span className="align-left">{participants[participants.length - 1].name} </span>
                    <p className="align-left">{messages[messages.length - 1].content}</p>
                </div> 
            </div>
        </button>
    );
}*/