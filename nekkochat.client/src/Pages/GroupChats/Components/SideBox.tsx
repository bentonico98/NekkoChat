import { iConversationClusterProps, iSideBoxProps } from "../../../Constants/Types/CommonTypes";
import ProfileHeader from "../../Shared/ProfileHeader";
import avatar from "../../../assets/avatar.png";

import { Sidebar,  ConversationList, Conversation, Avatar } from '@chatscope/chat-ui-kit-react';
import MessageServicesClient from "../../../Utils/MessageServicesClient";
import FirstLetterUpperCase from "../../../Utils/FirstLetterUpperCase";
import useGetReceiver from "../../../Hooks/useGetReceiver";
import ProfileHeaderSkeleton from "../../Shared/Skeletons/ProfileHeaderSkeleton";
import ConversationSkeleton from "../../Shared/Skeletons/ConversationSkeleton";
import { Divider } from "@mui/material";
import { useEffect, useState } from "react";
export default function SideBox({ messages, user, setCurrentConversation, trigger, DisplayMessage }: iSideBoxProps) {

    const { getUnreadMessages } = useGetReceiver(user, DisplayMessage);

    const [data, setData] = useState<iConversationClusterProps[]>([]);

    const refresh = () => {
        if (messages.length > 0) {
            setData([...messages]);
        }
    };

    useEffect(() => {
        if (messages.length > 0) {
            refresh();
        }
    }, [messages]);

    return (
        <Sidebar
            position="left"
            scrollable={false}
            style={{ minHeight: "100vh" }}>
            {user ? <ProfileHeader item={messages} func={setData} refresh={refresh} category="Group Chats" key={1} /> : <ProfileHeaderSkeleton />}

            <Divider />
            {data && data.length > 0 ? 
            <ConversationList>
                    {data.map((el: iConversationClusterProps, idx: number) => {
                    return (<Conversation
                        key={idx}
                        name={FirstLetterUpperCase(el.groupname || "Unknown")}
                        lastSenderName={el.messages[el.messages.length - 1].username}
                        info={el.messages[el.messages.length - 1].content}
                        unreadCnt={getUnreadMessages(el.messages)}
                        onClick={async () => {
                            setCurrentConversation(parseInt(el._id));
                            await MessageServicesClient.sendReadMessageGroup({
                                group_id: parseInt(el._id),
                                sender_id: user,
                                user_id:user,
                                groupname: el.groupname,
                                groupdesc: "No Desc",
                                groupphoto: "No Photo",
                                grouptype: "No Type",
                                participants: el.participants,
                                value: "No Message"
                            });
                            await trigger();
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
