export default class MessageSchema {
    public chat_id: number;
    public sender_id: number;
    public receiver_id: number;
    public text: string;
    public user: string;
    public timestamp:string;
    constructor(chat_id: number, sender_id: number, receiver_id: number, text: string, user: string, timestamp: string) {
        this.chat_id = chat_id;
        this.sender_id = sender_id;
        this.receiver_id = receiver_id;
        this.text = text;
        this.user = user;
        this.timestamp = timestamp;
    }
}