export default class GroupMessageSchema {
    public group_id: number;
    public groupname: string;
    public grouptype: string;
    public groupdesc: string;
    public groupphoto: string;
    public content: string;
    public sender_id: string;

    constructor(group_id: number, groupname: string, grouptype: string, groupdesc: string, groupphoto: string, content: string, sender_id: string) {
        this.group_id = group_id;
        this.groupname = groupname;
        this.grouptype = grouptype;
        this.groupdesc = groupdesc;
        this.groupphoto = groupphoto;
        this.content = content;
        this.sender_id = sender_id;
    }
}