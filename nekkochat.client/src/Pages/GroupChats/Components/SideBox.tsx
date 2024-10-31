import { iConversationClusterProps, iSideBoxProps } from "../../../Constants/Types/CommonTypes";
import ProfileHeader from "../../Shared/ProfileHeader";
import avatar from "../../../assets/avatar.png";

import { Sidebar, Search, ConversationList, Conversation, Avatar } from '@chatscope/chat-ui-kit-react';
import MessageServicesClient from "../../../Utils/MessageServicesClient";
import FirstLetterUpperCase from "../../../Utils/FirstLetterUpperCase";
import useGetReceiver from "../../../Hooks/useGetReceiver";
import ProfileHeaderSkeleton from "../../Shared/Skeletons/ProfileHeaderSkeleton";
import ConversationSkeleton from "../../Shared/Skeletons/ConversationSkeleton";
export default function SideBox({ messages, user, setCurrentConversation, DisplayMessage }: iSideBoxProps) {

    const { getUnreadMessages } = useGetReceiver(user, DisplayMessage);

    return (
        <Sidebar
            position="left"
            scrollable={false}
            style={{ minHeight: "100vh" }}>

            {user ? <ProfileHeader /> : <ProfileHeaderSkeleton />}

            <Search
                placeholder="Search..." />

            {messages && messages.length > 0 ? 

            <ConversationList>
                {messages.map((el: iConversationClusterProps, idx: number) => {
                    return (<Conversation
                        key={idx}
                        name={FirstLetterUpperCase(el.messages[0].groupname || el.groupname || "Unknown")}
                        lastSenderName={el.messages[el.messages.length - 1].username}
                        info={el.messages[el.messages.length - 1].content}
                        unreadCnt={getUnreadMessages(el.messages)}
                        onClick={async () => {
                            setCurrentConversation(el._id);
                            await MessageServicesClient.sendReadMessageGroup({
                                group_id: parseInt(el._id),
                                sender_id: user,
                                groupname: el.groupname
                            });
                        }}>
                        <Avatar
                            src={avatar}
                            name={el.participants[el.participants.length - 1].name}
                        />
                    </Conversation>
                )})}
                </ConversationList>
                :
                <ConversationSkeleton />}  
        </Sidebar>
    );
}
