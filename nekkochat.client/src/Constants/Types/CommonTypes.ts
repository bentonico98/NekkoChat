export interface ErrorInterface {
    email?: string,
    username?: string,
    password?: string,
    confirmpassword?: string,
}
export interface iUserVideoCallTypes{
    name: string,
    photo: string,
    id:string
}
export interface iLoginTypes {
    email: string,
    password: string,
    remember: boolean
}

export interface iRegisterTypes {
    email: string;
    fname: string;
    lname: string;
    password: string;
    confirmPassword: string;
    phoneNumber?: string;
    remember: boolean;
    profilePhotoUrl?: string;
    about?: string;
}

export interface iNotificationTypes {
    user_id?: string
    id?: string
    operation?: string
    type?: number
    from?: string
    from_id?:string
    url?: string
    seen?: boolean
}
export interface iDisplayMessageTypes {
    hasError?: boolean,
    error?: string,
    hasMsj?: boolean,
    msj?: string,
    hasNotification?: boolean,
    notification?: string,
    isLoading?: boolean,
}
export interface iServeResponseTypes {
    success: boolean,
    user: iConversationClusterProps[],
    message: string,
    error: string,
    statusCode: number
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
    connectionid?: string | null | undefined
}
export interface iGroupRequestTypes {
    sender_id?: string,
    user_id?: string,
    group_id?: number,
    groupname?: string,
    grouptype?: string,
    groupdesc?: string,
    groupphoto?: string,
    value?: string,
    participants?: iparticipants[]
}
export interface iparticipants {
    id: string,
    name: string,
    connectionid: string,
    profilePic:string
}

export interface iuserStore {
    value: iUserViewModel,
    modalOpened: boolean,
    errorModalOpened: boolean,
    msjModalOpened: boolean,
    notificationModal: boolean,
    notificationCount: string,
    profileModal: boolean,
    settingModal: boolean,
    error: string | null | undefined
    message: string | null | undefined
    notification: string | null | undefined,
    isLoading: boolean | undefined,
}

export interface iUserViewModel {
    id: string,
    userName: string,
    fname: string,
    lname: string,
    connectionId: string,
    profilePhotoUrl: string,
    friends_Count?: number,
    about?: string,
    lastOnline?: string,
    isFriend?: boolean,
    isSender?: boolean,
    canSendRequest?: boolean,
    alreadyRequest?:boolean
}
export interface IUserEditTypes {
    user_id: string,
    fname: string,
    lname: string,
    about?: string,
}

export interface iResponseViewModel {
    success?: boolean | null;
    user?: iUserViewModel | null;
    message?: string | null;
    error?: string | null;
    status?: number | null;
}
export interface iChatSchema {
    id: string,
    content?: string,
    username?: string,
    user_id?: string,
    created_at?: string,
    read?: boolean,
    groupname?: string | undefined,
    group_id?:number | undefined
}
export interface iConversationClusterProps {
    _id: string,
    messages: iChatSchema[],
    participants: iparticipants[],
    groupname?: string,
    status?: string
}

export interface iSideBoxProps {
    messages: iConversationClusterProps[],
    user: string,
    setCurrentConversation: (arg: any) => void,
    trigger:()=> void,
    DisplayMessage: (obj: iDisplayMessageTypes) => void
}
export interface iTypingComponentProps {
    typing: boolean,
    user_id: string,
    username?: string,
    group_id?: string,
    groupname?:string
}
export interface iChatMessagesProps {
    messages: iChatSchema[],
    connected: boolean,
    chat: number,
    sender: string,
    receiver: string | number,
    participants: iparticipants[],
    isTyping: iTypingComponentProps,
    trigger: () => void,
    DisplayMessage: (obj: iDisplayMessageTypes) => void
                            
}
export interface iGroupChatMessagesProps {
    messages: iChatSchema[],
    connected: boolean,
    chat?: number,
    sender: string,
    receiver: number,
    participants: iparticipants[],
    isTyping: iTypingComponentProps,
    trigger: () => void,
    DisplayMessage: (obj: iDisplayMessageTypes) => void
}