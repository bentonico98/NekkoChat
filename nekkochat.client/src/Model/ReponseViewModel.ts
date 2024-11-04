import { iResponseViewModel, iUserViewModel } from "../Constants/Types/CommonTypes";
import UserViewModel from "./UserViewModel";

export default class ResponseViewModel implements iResponseViewModel {
    public Success?: boolean | null;
    public User?: iUserViewModel | null;
    public Message?: string | null;
    public Error?: string | null;
    public Status?: number | null;

    constructor(
        success: boolean = false,
        status: number | null,
        user: iUserViewModel | null = new UserViewModel(),
        msj: string | null = "Failed",
        err: string | null = null) {

        this.Success = success;
        this.User = user;
        this.Message = msj;
        this.Error = err;
        this.Status = status;
    }

}