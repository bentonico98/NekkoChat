import { iChatSchema } from "../Constants/Types/CommonTypes";

export default class ChatSchema implements iChatSchema {
    public id: string;
    public content?: string;
    public username?: string;
    public user_id?: string;
    public created_at?: string;
    public read: boolean
    constructor(id: string, user_id: string, username: string, content: string, created_at: string, read:boolean) {
        this.id = id;
        this.content = content;
        this.username = username;
        this.user_id = user_id;
        this.created_at = created_at;
        this.read = read;
    }
}