import { groupServer, privateServer } from "../Constants/ServerInstance";
import { iDisplayMessageTypes } from "../Constants/Types/CommonTypes";

export default class NotificationServerServices {

    public static dispatchFunction: (obj: iDisplayMessageTypes) => void;

    public static Listen(DisplayMessage: (obj: iDisplayMessageTypes) => void) {

        this.dispatchFunction = DisplayMessage;

        if (groupServer.state == "Connected" || privateServer.state == "Connected") {
            try {

                privateServer.on("ReceiveNotification", (user_id: string) => {
                    DisplayMessage({
                        hasNotification: true,
                        notification: "+1 New Notification"
                    });
                    return user_id;
                });
                groupServer.on("ReceiveNotification", (user_id: string) => {
                    DisplayMessage({
                        hasNotification: true,
                        notification: "+1 New Notification"
                    });
                    return user_id;
                });

            } catch (er) {
                DisplayMessage({
                    hasError: true,
                    error: "Server Is Down, Try Again."
                });
            }
        }
    }
};