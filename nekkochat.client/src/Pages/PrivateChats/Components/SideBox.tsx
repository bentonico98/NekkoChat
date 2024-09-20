import SideBoxCard from "./SideBoxCard";

interface incomingData {
    day: string,
    data: object[]
}
export default function SideBox({ messages, setCurrentConversation }: any) {

    return (
        <div className="messageContainer">
            {messages.map((el: incomingData, idx: number) => {
                return (
                    <div key={idx}>
                        <SideBoxCard key={idx} chat={el} setCurrentConversation={setCurrentConversation } />
                    </div>
                );
            })}
        </div>
    );
}