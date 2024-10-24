import avatar from "../assets/avatar.png"
import { iUserViewModel } from "../Constants/Types/CommonTypes";
export default class UserViewModel implements iUserViewModel {
    public Id: string;
    public UserName: string;
    public ProfilePhotoUrl: string;
    public Friends_Count: number;
    public ConnectionId: string;
    public About: string;
    public LastOnline: string;

    constructor(
        id: string = "0",
        username: string = "Unknown",
        connectionId: string = "0",
        profilepic: string = avatar,
        friendCount: number = 0,
        about: string = "My History",
        lastOnline: string = "Offline" ) {

        this.Id = id;
        this.UserName = username;
        this.ConnectionId = connectionId;
        this.ProfilePhotoUrl = profilepic,
        this.Friends_Count = friendCount;
        this.About = about;
        this.LastOnline = lastOnline;
    }
}