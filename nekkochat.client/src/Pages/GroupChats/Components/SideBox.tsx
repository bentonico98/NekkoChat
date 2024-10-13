import ProfileHeader from "../../Shared/ProfileHeader";
import SideBoxCard from "./SideBoxCard";

import { Sidebar,  Search, ConversationList } from '@chatscope/chat-ui-kit-react';
export default function SideBox({ messages, user, setCurrentConversation}: any) {
    return (
        <Sidebar position="left" scrollable={false}>
            <ProfileHeader />
            <Search placeholder="Search..." />
            <ConversationList>
                {messages.map((el: any, idx: number) => {
                    return (<SideBoxCard key={idx} user={user} chat={el} setCurrentConversation={setCurrentConversation}  />);
                })}
            </ConversationList>
        </Sidebar>
    );
}
