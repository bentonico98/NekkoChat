import {  useCallback } from "react";
import { iparticipants } from "../Constants/Types/CommonTypes";

export default function useGetParticipants(user: string) {

    const getParticipant = useCallback((participants: iparticipants[]) => {
        const username = participants ? participants.filter((p: iparticipants) => p.id != user) : [{ name: "Unknown", id: "0", profilePic: "/src/assets/avatar.png" }];
        return username[0].name;
    }, [user]);

    const getParticipantPic = useCallback((participants: iparticipants[]) => {
        const username = participants ? participants.filter((p: iparticipants) => p.id != user) : [{ name: "Unknown", id: "0", profilePic: "/src/assets/avatar.png" }];
        if (username.length <= 0 || !username[0].profilePic) {
            return "/src/assets/avatar.png";
        }
        return username[0].profilePic;
    }, [user]);

    const getGroupParticipantPic = useCallback((participants: iparticipants[] | undefined, pId: string | undefined) => {
        const username = participants ? participants.filter((p: iparticipants) => p.id == pId) : [{ name: "Unknown", id: "0", profilePic: "/src/assets/avatar.png" }];
        if (username.length <= 0 || !username[0].profilePic) {
            return "/src/assets/avatar.png";
        }
        return username[0].profilePic;
    }, [user]);

    return { getParticipantName: getParticipant, getPic: getParticipantPic, getGroupPic: getGroupParticipantPic };
}