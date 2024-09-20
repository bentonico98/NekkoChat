import "../PrivateChats.css";
import ChatSchema from "../../../Schemas/ChatSchema";

interface incomingData {
    _id: string, 
    messages: object[],
    participants: object[]
}

export default function ChatMessages({ messages }: any) {
    return (
        <div className="messageContainer">
            {messages.map((el: incomingData, idx: number) => {
                return (
                    <div key={idx}>
                        {el.messages.map((els: ChatSchema, idxs: number) => {
                            return (
                                <div key={idxs} className="message">
                                    <div>{els.username}: {els.content}</div>
                                    <div> -- {els.created_at} </div>
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}