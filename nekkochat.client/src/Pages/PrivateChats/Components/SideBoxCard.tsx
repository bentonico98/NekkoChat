import "../Inbox.css";
export default function SideBoxCard({ chat, setCurrentConversation }: any) {
    return (
        <button key={chat._id} onClick={() => { setCurrentConversation(chat._id) } }>
            <div>
                {chat.participants && <div className="sideboxHeadItems">
                    <span className="align-left">{chat.participants[chat.participants.length - 1].name} </span>
                    <p className="align-left">{chat.messages[chat.messages.length - 1].content}</p>
                </div> }
            </div>
        </button>
    );
}