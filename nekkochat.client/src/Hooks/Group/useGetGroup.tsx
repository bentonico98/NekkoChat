import { useEffect, useState } from "react";
import timeAgo from "../../Utils/TimeFormatter";
import MessageServicesClient from "../../Utils/MessageServicesClient";
import { iChatSchema, iDisplayMessageTypes } from "../../Constants/Types/CommonTypes";

export default function useGetGroup(user: string, messages: iChatSchema[], group_id: number, DisplayMessage: (obj: iDisplayMessageTypes) => void) {
    const [groupName, setGroupName] = useState<string>("Unknown");
    const [groupType, setGroupType] = useState<string>("");
    const [groupDesc, setGroupDesc] = useState<string>("");
    const [groupPhoto, setGroupPhoto] = useState<string>("");

    const [startDate, setStartDate] = useState<string | undefined>();
    const [unreadMsj, setUnreadMsj] = useState<number | undefined>();
  
    const getUnreadMessages = () => {
        const message: iChatSchema[] = messages.filter((i: iChatSchema) => i.read === false && i.user_id !== user);
        setUnreadMsj(message.length);
    }
    const getGroup = async (group_id: number) => {
        DisplayMessage({ isLoading: true });

        const res = await MessageServicesClient.getGroupById(group_id);
        if (res.success) {
            setGroupType(res.singleUser.type);
            setGroupDesc(res.singleUser.description);
            setGroupPhoto(res.singleUser.profilePhotoUrl);
            setGroupName(res.singleUser.name);
            DisplayMessage({ isLoading: false });

        } else {
            if (res.internalMessage) return DisplayMessage({
                hasError: true,
                error: res.internalMessage,
                isLoading: true
            });
            DisplayMessage({
                hasError: true,
                error: res.error,
                isLoading: true
            });
        }
    }
    const getChatStartDate = (filter: iChatSchema[]) => {
        const date: string = filter[0]?.created_at || new Date().toDateString();
        const formattedDate = timeAgo(date);
        if (formattedDate) {
            setStartDate(formattedDate);
        }
    }
    
    const getReceiver = () => {
        const filter = messages.filter((i: iChatSchema) => i.user_id !== user);
        getChatStartDate(filter);
        getUnreadMessages();
        getGroup(group_id);
    }

    useEffect(() => {
        getReceiver();
    }, [user, messages]);

    return { groupName, groupType, groupDesc, groupPhoto, unreadMsj, startDate, getReceiver };
}