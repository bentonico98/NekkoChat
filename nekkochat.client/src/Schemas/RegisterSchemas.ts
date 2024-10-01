export default class LoginSchemas {
    public email: string;
    public username: string;
    public password: string;
    public confirmpassword: string;
    public phoneNumber: string;

    constructor(email: string, username: string, password: string, confirmpassword:string, phoneNumber: string) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.confirmpassword = confirmpassword;
        this.phoneNumber = phoneNumber;
    }

}