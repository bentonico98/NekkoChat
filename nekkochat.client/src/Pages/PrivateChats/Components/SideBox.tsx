import SideBoxCard from "./SideBoxCard";
import { Sidebar, Search, ConversationList} from '@chatscope/chat-ui-kit-react';
import ProfileHeader from "../../Shared/ProfileHeader";
interface incomingData {
    day: string,
    data: object[]
}
export default function SideBox({ messages, user, setCurrentConversation }: any) {

    return (
        <Sidebar position="left" scrollable={false}>
            <ProfileHeader />
            <Search placeholder="Search..." />
            <ConversationList>
                {messages.map((el: incomingData, idx: number) => {
                    return (
                        <div key={idx}>
                            <SideBoxCard key={idx} user={user} chat={el} setCurrentConversation={setCurrentConversation}  />
                        </div>
                    );
                })}
            </ConversationList>
        </Sidebar>
    );
}
