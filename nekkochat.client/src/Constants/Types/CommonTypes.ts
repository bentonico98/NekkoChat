export interface ErrorInterface {
    email?: string,
    username?: string,
    password?: string,
    confirmpassword?:string,
}

export interface iparticipants {
    id: string,
    name: string,
    connectionid: string
}

export interface iuserStore {
    value: any,
    modalOpened: boolean
}