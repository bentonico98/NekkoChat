import { useEffect, useState } from "react";
import ChatSchema from "../Schemas/ChatSchema";

export default function useGetReceiver(user: string, messages: any) {
    const [receiverName, setReceiver] = useState("");

    const getReceiver = () => {
        const filter = messages.filter((i: ChatSchema) => i.user_id != user);
        const username = filter[0]?.username || "Unknown";
        setReceiver(username);
    }

    useEffect(() => {
        getReceiver();
    }, [user, messages]);

    return {  receiverName, getReceiver };
}