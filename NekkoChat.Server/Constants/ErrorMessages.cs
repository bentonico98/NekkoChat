namespace NekkoChat.Server.Constants
{
    public static class ErrorMessages
    {
        public static string ErrorRegular { get; set; } = "An Error Ocured.";
        public static string ErrorMessage { get; set; } = "Something Went Wrong.";
        public static string NotAllowed { get; set; } = "Access Denied.";
        public static string NoExist { get; set; } = "Record Doesnt Exist";
        public static string FriendAlready { get; set; } = "User Already In Friend List";
        public static string FriendRequestAlready { get; set; } = "Friend Already Sent";
        public static string Invalid { get; set; } = "Invalid";
        public static string Success { get; set; } = "Successful";
        public static string WrongCredentials { get; set; } = "Wrong Credentials, Please Try Again";
        public static string MissingValues { get; set; } = "Missing Mandatory Values.";
        public static string Failed { get; set; } = "Operation Failed.";

    }
}
