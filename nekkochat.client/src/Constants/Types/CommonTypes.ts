export interface ErrorInterface {
    email?: string,
    username?: string,
    password?: string,
    confirmpassword?: string,
}

export interface iparticipants {
    id: string,
    name: string,
    connectionid: string
}

export interface iuserStore {
    value: iUserViewModel,
    modalOpened: boolean
}

export interface iUserViewModel {
    id: string,
    userName: string,
    connectionId: string,
    profilePhotoUrl: string,
    friends_Count?: number ,
    about?: string,
    lastOnline?: string
}

export interface iResponseViewModel {
     Success: boolean;
     User: iUserViewModel;
     Message: string;
     Error?: string | null;
     Status: number;
}
export interface iChatSchema {
    id: string,
    content?: string,
    username?: string,
    user_id?: string,
    created_at?: string,
    read?: boolean,
    groupname?: string,
}
export interface iConversationClusterProps {
    _id: string,
    messages: iChatSchema[],
    participants: iparticipants[],
    groupname?: string,
}

export interface iSideBoxProps {
    messages: iConversationClusterProps[],
    user: string,
    setCurrentConversation: (arg: any) => void
}
export interface iSideBoxCardProps {
    chat: iConversationClusterProps,
    user: string ,
    setCurrentConversation: (arg: string) => void
}

export interface iTypingComponentProps {
    typing: boolean,
    user_id: string,
    username?: string
}

export interface iChatBoxProps {
    connected: boolean,
    sender: string,
    receiver: string,
    chat: number
}

export interface iChatMessagesProps {
    messages: iChatSchema[],
    connected: boolean,
    chat: number,
    sender: string,
    receiver: string | number,
    participants: iparticipants[],
    isTyping: iTypingComponentProps
}
export interface iGroupChatMessagesProps {
    messages: iChatSchema[],
    connected: boolean,
    chat?: number,
    sender: string,
    receiver: number,
    participants?: iparticipants[],
    isTyping: iTypingComponentProps
}