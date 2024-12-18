export default class MessageSchema {
    public chat_id: number;
    public sender_id: string;
    public receiver_id: string;
    public content: string;
    public user_id: string;
    public username: string;
    public created_at:string;
    constructor(chat_id: number, sender_id: string, receiver_id: string, content: string, user_id: string, username: string, created_at: string) {
        this.chat_id = chat_id;
        this.sender_id = sender_id;
        this.receiver_id = receiver_id;
        this.content = content;
        this.user_id = user_id;
        this.username = username;
        this.created_at = created_at;
    }
}