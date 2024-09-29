import SideBoxCard from "./SideBoxCard";
import { Sidebar,  Search, ConversationList } from '@chatscope/chat-ui-kit-react';

interface incomingData {
    day: string,
    data: object[]
}
export default function SideBox({ messages, user, setCurrentConversation }: any) {

    return (
        <Sidebar position="left" scrollable={false}>
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
/**
            
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
<Conversation name="Joe" lastSenderName="Joe" info="Yes i can do it for you">
                    <Avatar src={avatar} name="Joe" status="dnd" />
                </Conversation>

                <Conversation name="Emily" lastSenderName="Emily" info="Yes i can do it for you" unreadCnt={3}>
                    <Avatar src={avatar} name="Emily" status="available" />
                </Conversation>

                <Conversation name="Kai" lastSenderName="Kai" info="Yes i can do it for you" unreadDot>
                    <Avatar src={avatar} name="Kai" status="unavailable" />
                </Conversation>

                <Conversation name="Akane" lastSenderName="Akane" info="Yes i can do it for you">
                    <Avatar src={avatar} name="Akane" status="eager" />
                </Conversation>

                <Conversation name="Eliot" lastSenderName="Eliot" info="Yes i can do it for you">
                    <Avatar src={avatar} name="Eliot" status="away" />
                </Conversation>

                <Conversation name="Zoe" lastSenderName="Zoe" info="Yes i can do it for you">
                    <Avatar src={avatar} name="Zoe" status="dnd" />
                </Conversation>

                <Conversation name="Patrik" lastSenderName="Patrik" info="Yes i can do it for you">
                    <Avatar src={avatar} name="Patrik" status="invisible" />
                </Conversation>

            */