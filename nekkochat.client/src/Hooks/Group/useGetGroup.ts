import { useEffect, useState } from "react";
import GroupChatSchema from "../../Schemas/GroupChatSchema";
import timeAgo from "../../Utils/TimeFormatter";
import MessageServicesClient from "../../Utils/MessageServicesClient";

export default function useGetGroup(user: string, messages: any, group_id:number) {
    const [groupName, setGroupName] = useState<string>("");
    const [groupType, setGroupType] = useState<string>("");
    const [groupDesc, setGroupDesc] = useState<string>("");
    const [groupPhoto, setGroupPhoto] = useState<string>("");

    const [startDate, setStartDate] = useState<string | undefined>();
    const [unreadMsj, setUnreadMsj] = useState<number | undefined>();
  
    const getUnreadMessages = () => {
        const message: any = messages.filter((i: GroupChatSchema) => i.read === false && i.user_id !== user);
        setUnreadMsj(message.length);
    }
    const getGroup = async (group_id: number) => {
        const res = await MessageServicesClient.getGroupById(group_id);
        setGroupType(res.type);
        setGroupDesc(res.description);
        setGroupPhoto(res.profilePhotoUrl);
    }
    const getChatStartDate = (filter: any) => {
        const date: any = filter[0]?.created_at || new Date().toJSON();
        const formattedDate = timeAgo(date);
        if (formattedDate) {
            setStartDate(formattedDate);
        }
    }
    
    const getReceiver = () => {
        const filter = messages.filter((i: GroupChatSchema) => i.user_id != user);
        const groupname = filter[0]?.groupname || "Unknown";
        setGroupName(groupname);
        getChatStartDate(filter);
        getUnreadMessages();
        getGroup(group_id);
    }

    useEffect(() => {
        getReceiver();
    }, [user, messages]);

    return { groupName, groupType, groupDesc, groupPhoto, unreadMsj, startDate, getReceiver };
}