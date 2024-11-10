import { useCallback } from "react";
import timeAgo from "../Utils/TimeFormatter";
import MessageServicesClient from "../Utils/MessageServicesClient";
import GetUserStatusService from "../Utils/GetUserStatusService";
import { iChatSchema, iDisplayMessageTypes, iparticipants } from "../Constants/Types/CommonTypes";

export default function useGetReceiver(user: string, DisplayMessage: (obj: iDisplayMessageTypes) => void) {
    
    const fetchUser = async (id: string) => {
        DisplayMessage({ isLoading: true });

        const res = await MessageServicesClient.getUserById(id, user);
        if (res.success) {
            DisplayMessage({
                hasMsj: true,
                msj: `${res.singleUser.userName} is ${res.singleUser.status}.`,
                isLoading: false
            });
            return GetUserStatusService(res.singleUser.status);
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
    };
    const fetchUserByParticipantId = async (participants: iparticipants[]) => {
        const filter: iparticipants[] = participants.filter((p) => p.id !== user);

        const id: string = filter[0].id;

        const res = await MessageServicesClient.getUserById(id,user);
        if (res.success) {
            return GetUserStatusService(res.singleUser.status);
        }
    };
    const getUnreadMessages = useCallback((messages: iChatSchema[]) => {
        const filter = getParticipants(messages);
        if (filter.length <= 0) return;

        const message: iChatSchema[] = messages.filter((i: iChatSchema) => i.read === false && i.user_id !== user);
        return message.length;
    }, [user])

    const getChatStartDate = useCallback((messages: iChatSchema[]) => {
        const filter = getParticipants(messages);
        if (filter.length <= 0) return;

        const date: string = filter[0]?.created_at || new Date().toJSON();

        const formattedDate = timeAgo(date);

        return formattedDate;
    }, [user]);

    const getLastOnline = useCallback((messages: iChatSchema[]) => {
        const filter = getParticipants(messages);
        if (filter.length <= 0) return;

        const date: string = filter[filter.length - 1]?.created_at || new Date().toJSON();

        const formattedDate = timeAgo(date);

        return formattedDate;

    }, [user])

    const getReceiverName = useCallback((messages: iChatSchema[]) => {
        const filter = getParticipants(messages);
        if (filter.length <= 0) return;

        return filter[0]?.username || "";
    }, [user]);

    const getParticipants = (messages: iChatSchema[]) => {
        return messages.filter((i: iChatSchema) => i.user_id !== user);
    }

    return { getLastOnline, getUserStatus: fetchUser, getParticipantStatus: fetchUserByParticipantId, getReceiverName, getUnreadMessages, getChatStartDate };
}