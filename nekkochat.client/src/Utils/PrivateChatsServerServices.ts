import ServerInstance from "../Constants/ServerInstance";
import { privateServer } from "../Constants/ServerInstance";
import { iDisplayMessageTypes, iNotificationTypes, iServerRequestTypes } from "../Constants/Types/CommonTypes";

export default class PrivateChatsServerServices {

    public static dispatchFunction: (obj: iDisplayMessageTypes) => void;

    public static async Listen(addToChat: any, DisplayMessage: (obj: iDisplayMessageTypes) => void) {

        this.dispatchFunction = DisplayMessage;

        if (privateServer.state != "Disconnected") {

            try {

                privateServer.on("ReceiveSpecificMessage", (user_id: string, msj: string) => {
                    addToChat(user_id, msj, false);
                });

                privateServer.on("ReceiveTypingSignal", (user: string) => {
                    addToChat(null, null, { typing: true, user_id: user });
                });
            } catch (er) {
                DisplayMessage({
                    hasError: true,
                    error: "Server Is Down, Try Again."
                });
                setTimeout(async () => {
                    if (privateServer.state == "Disconnected") {
                        await ServerInstance.StartPrivateServer();
                        return { success: true, conn: privateServer.connectionId };
                    }
                }, 1500);
            }
            return { success: true, conn: privateServer.connectionId };
        } else if (privateServer.state == "Disconnected") {

            const connection = await ServerInstance.StartGroupServer();
            return { success: true, conn: connection.connectionId };
        } else {
            try {
                const connection = await ServerInstance.StartGroupServer();

                return { success: true, conn: connection.connectionId };
            } catch (ex) {
                return { success: false, conn: null };
            }
        }
    }

    public static async SendMessageToUserInvoke(data: iServerRequestTypes) {
        try {
            privateServer.invoke("SendMessage", data.sender_id, data.receiver_id, data.value);
        } catch (er) {
            this.dispatchFunction({
                hasError: true,
                error: "Error Sending Message."
            });
            await ServerInstance.StartPrivateServer();
        }
    }
    public static async SendTypingSignal(data: iServerRequestTypes) {
        try {
            privateServer.invoke("SendTypingSignal", data.sender_id, data.receiver_id);
        } catch (er) {
            this.dispatchFunction({
                hasError: true,
                error: "Server Is Down, Try Again."
            });
            await ServerInstance.StartPrivateServer();
        }
    }

    public static async SendNotificationToUser(
        data: iNotificationTypes,
        DisplayMessage: (obj: iDisplayMessageTypes) => void) {
        try {
            privateServer.invoke("SendNotificationToUser", data);
        } catch (er) {
            DisplayMessage({
                hasError: true,
                error: "Failed To Send Notification."
            });
            await ServerInstance.StartPrivateServer();
        }
    }
   
};