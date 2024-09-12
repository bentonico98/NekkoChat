import "../PrivateChats.css";
import ChatSchema from "../../../Schemas/ChatSchema";
export default function ChatMessages({ messages }: any) {
    return (
        <div className="messageContainer">
            {messages.map((el: ChatSchema, idx: number) => {
                return (
                    <div key={idx} className="message"><div>
                        {el.content}
                    </div>
                        <div>-- {el.created_at}</div></div>
                );
            })}
        </div>
    );
}