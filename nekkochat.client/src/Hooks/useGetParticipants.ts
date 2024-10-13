import { useEffect, useState } from "react";
import { iparticipants } from "../Constants/Types/CommonTypes";

export default function useGetParticipants(participants: iparticipants[], user:string) {
    const [participantName, setParticipantName] = useState("");

    const getParticpant = () => {
        const username = participants ? participants.filter((p: iparticipants) => p.id != user) : [{ name: "Unknown", id: "0" }];
        setParticipantName(username[0].name);
    }

    useEffect(() => {
        getParticpant();
    }, [participants]);

    return { participantName };
}