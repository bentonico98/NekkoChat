import avatar from "../assets/avatar.png"
import { iUserViewModel } from "../Constants/Types/CommonTypes";
export default class UserViewModel implements iUserViewModel {
    public id: string;
    public userName: string;
    public fname: string;
    public lname: string;
    public profilePhotoUrl: string;
    public friends_Count: number;
    public connectionId: string;
    public about: string;
    public lastOnline: string;

    constructor(
        id: string = "0",
        username: string = "Unknown",
        fname: string = "Unknown",
        lname: string = "Unknown",
        connectionId: string = "0",
        profilepic: string = avatar,
        friendCount: number = 0,
        about: string = "My History",
        lastOnline: string = "Offline") {

        this.id = id;
        this.userName = username;
        this.fname = fname;
        this.lname = lname;
        this.connectionId = connectionId;
        this.profilePhotoUrl = profilepic;
        this.friends_Count = friendCount;
        this.about = about;
        this.lastOnline = lastOnline;
    }
}