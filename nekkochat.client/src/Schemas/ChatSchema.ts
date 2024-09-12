export default class ChatSchema {
    public id: string;
    public content: string;
    public created_at: string;

    constructor(id: string, content: string, created_at: string) {
        this.id = id;
        this.content = content;
        this.created_at = created_at;
    }
}