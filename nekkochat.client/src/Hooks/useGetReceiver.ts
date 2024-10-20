import { useEffect, useState } from "react";
import ChatSchema from "../Schemas/ChatSchema";
import timeAgo from "../Utils/TimeFormatter";
import MessageServicesClient from "../Utils/MessageServicesClient";
import GetUserStatusService from "../Utils/GetUserStatusService";
import { UserStatus } from "@chatscope/chat-ui-kit-react/src/types/unions";

export default function useGetReceiver(user: string, messages: ChatSchema[]) {
    const [receiverName, setReceiverName] = useState("");
    const [receiverStatus, setReceiverStatus] = useState<UserStatus>("unavailable");
    const [lastOnline, setLastOnline] = useState<string | undefined>();
    const [startDate, setStartDate] = useState<string | undefined>();
    const [unreadMsj, setUnreadMsj] = useState<number | undefined>();

    const fetchUser = async (filter: ChatSchema[]) => {
        const id: string = filter[0].user_id || "0";
        const res = await MessageServicesClient.getUserById(id);
        setReceiverStatus(GetUserStatusService(res.status));
    }
    const getUnreadMessages = () => {
        const message: ChatSchema[] = messages.filter((i: ChatSchema) => i.read === false && i.user_id !== user);
        setUnreadMsj(message.length);
    }

    const getChatStartDate = (filter: ChatSchema[]) => {
        const date: string = filter[0]?.created_at || new Date().toJSON();

        const formattedDate = timeAgo(date);

        if (formattedDate) {
            setStartDate(formattedDate);
        }
    }

    const getLastOnline = (filter: ChatSchema[]) => {
        const date: string = filter[filter.length - 1]?.created_at || new Date().toJSON();

        const formattedDate = timeAgo(date);

        if (formattedDate) {
            setLastOnline(formattedDate);
        }
    }
    const getReceiver = () => {
        const filter = messages.filter((i: ChatSchema) => i.user_id !== user);

        if (filter.length <= 0) return;

        const username = filter[0]?.username || "";
        setReceiverName(username);
        fetchUser(filter);
        getLastOnline(filter);
        getChatStartDate(filter);
        getUnreadMessages();
    }

    useEffect(() => {
        getReceiver();
    }, [user, messages]);

    return { receiverName, unreadMsj, lastOnline, startDate, receiverStatus, getReceiver };
}