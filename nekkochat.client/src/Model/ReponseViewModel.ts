import { iResponseViewModel, iUserViewModel } from "../Constants/Types/CommonTypes";
import UserViewModel from "./UserViewModel";

export default class ResponseViewModel implements iResponseViewModel {
    public Success: boolean;
    public User: iUserViewModel;
    public Message: string;
    public Error: string | null;
    public Status: number;

    constructor(
        success: boolean,
        status: number,
        user: iUserViewModel = new UserViewModel(),
        msj: string = "Successful",
        err: string | null = null) {

        this.Success = success;
        this.User = user;
        this.Message = msj;
        this.Error = err;
        this.Status = status;
    }

}