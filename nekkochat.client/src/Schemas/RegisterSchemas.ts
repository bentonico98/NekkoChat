export default class LoginSchemas {
    public email: string;
    public fname: string;
    public lname: string;
    public password: string;
    public confirmpassword: string;
    public phoneNumber: string;
    public remember: boolean;
    public profilePhotoUrl: string;
    public about: string;
    constructor(
        email: string,
        fname: string,
        lname: string,
        password: string,
        confirmpassword: string,
        phoneNumber: string,
        profilePhotoUrl: string,
        about: string,
        remember: boolean,
    ) {
        this.email = email;
        this.fname = fname;
        this.lname = lname;
        this.password = password;
        this.confirmpassword = confirmpassword;
        this.phoneNumber = phoneNumber;
        this.remember = remember;
        this.profilePhotoUrl = profilePhotoUrl;
        this.about = about;
    }

}