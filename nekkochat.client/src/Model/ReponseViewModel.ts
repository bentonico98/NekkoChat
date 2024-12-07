import { iResponseViewModel, iUserViewModel } from "../Constants/Types/CommonTypes";
import UserViewModel from "./UserViewModel";

export default class ResponseViewModel implements iResponseViewModel {
    public success?: boolean | null;
    public user?: iUserViewModel | null;
    public message?: string | null;
    public error?: string | null;
    public status?: number | null;

    constructor(
        success: boolean = false,
        status: number | null,
        user: iUserViewModel | null = new UserViewModel(),
        msj: string | null = "Failed",
        err: string | null = null) {

        this.success = success;
        this.user = user;
        this.message = msj;
        this.error = err;
        this.status = status;
    }

}