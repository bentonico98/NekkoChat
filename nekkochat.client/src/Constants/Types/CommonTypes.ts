export interface ErrorInterface {
    email?: string,
    username?: string,
    password?: string,
    confirmpassword?: string,
}

export interface iServeResponseTypes {
    success: boolean,
    user: iConversationClusterProps[],
    message: string,
    error: string,
    statusCode:number
}
export interface iServerRequestTypes {
    sender_id?: string,
    receiver_id?: string,
    user_id?: string,
    operation?: string
    chat_id?: number;
    message_id?: string,
    value?: string,
    favorite?: boolean,
    archive?: boolean,
    connectionid?: string
}
export interface iGroupRequestTypes {
    sender_id?: string,
    group_id: number,
    groupname?: string,
    grouptype?: string,
    groupdesc?: string,
    groupphoto?: string,
    value?: string,
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
    friends_Count?: number,
    about?: string,
    lastOnline?: string,
    isFriend?: boolean,
    isSender?: boolean
}

export interface iResponseViewModel {
    Success?: boolean | null;
    User?: iUserViewModel | null;
    Message?: string | null;
    Error?: string | null;
    Status?: number | null;
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
    status?:string
}

export interface iSideBoxProps {
    messages: iConversationClusterProps[],
    user: string,
    setCurrentConversation: (arg: any) => void
}
export interface iSideBoxCardProps {
    chat: iConversationClusterProps,
    user: string,
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