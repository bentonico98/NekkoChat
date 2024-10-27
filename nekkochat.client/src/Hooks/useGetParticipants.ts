import {  useCallback } from "react";
import { iparticipants } from "../Constants/Types/CommonTypes";

export default function useGetParticipants(user: string) {

    const getParticipant = useCallback((participants: iparticipants[]) => {
        const username = participants ? participants.filter((p: iparticipants) => p.id != user) : [{ name: "Unknown", id: "0" }];
        return username[0].name;
    }, [user])

    return { getParticipantName: getParticipant };
}