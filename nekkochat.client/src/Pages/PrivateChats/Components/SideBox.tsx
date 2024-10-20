import SideBoxCard from "./SideBoxCard";
import { Sidebar, Search, ConversationList} from '@chatscope/chat-ui-kit-react';
import ProfileHeader from "../../Shared/ProfileHeader";
import { iConversationClusterProps, iSideBoxProps } from "../../../Constants/Types/CommonTypes";

export default function SideBox({ messages, user, setCurrentConversation }: iSideBoxProps) {

    return (
        <Sidebar position="left" scrollable={false}>
            <ProfileHeader />
            <Search placeholder="Search..." />
            <ConversationList>
                {messages.map((el: iConversationClusterProps, idx: number) => {
                    return (<SideBoxCard
                        key={idx}
                        user={user}
                        chat={el}
                        setCurrentConversation={setCurrentConversation} />);
                })}
            </ConversationList>
        </Sidebar>
    );
}
