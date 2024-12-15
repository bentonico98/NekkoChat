import ServerInstance, { groupServer } from "../Constants/ServerInstance";
import { AddToGroupChatType, iDisplayMessageTypes, iGroupRequestTypes, iNotificationTypes } from "../Constants/Types/CommonTypes";

export default class GroupChatsServerServices {

    public static dispatchFunction: (obj: iDisplayMessageTypes) => void;

    public static async Listen(addToChat: AddToGroupChatType, DisplayMessage: (obj: iDisplayMessageTypes) => void) {

        this.dispatchFunction = DisplayMessage;

        if (groupServer.state == "Connected") {
            try {
                groupServer.on("ReceiveSpecificMessage", (user_id: string, msj: string, username: string, group_id:string, groupname:string) => {
                    addToChat(user_id, username, msj, { typing: false, user_id, username }, group_id, groupname);
                });
                groupServer.on("ReceiveTypingSignal", (user: string, username: string, group_id: string, groupname: string) => {
                    addToChat(null, username, null, { typing: true, user_id: user, username: username }, group_id, groupname);
                });

            } catch (ex) {
                DisplayMessage({
                    hasError: true,
                    error: "Server Is Down, Try Again."
                });
                setTimeout(async () => {
                    if (groupServer.state == "Disconnected") {
                        await ServerInstance.StartGroupServer();
                        return { success: true, conn: groupServer.connectionId };
                    }
                }, 1500);
                console.log(ex);
            }
            return { success: true, conn: groupServer.connectionId };
        } else if (groupServer.state == "Disconnected") {
            const connection = await ServerInstance.StartGroupServer();
            return { success: true, conn: connection.connectionId };
        } else {
            try {
                const connection = await ServerInstance.StartGroupServer();
                return { success: true, conn: connection.connectionId };
            } catch (ex) {
                console.log(ex);
                return { success: false, conn: null };
            }
        }
    }
    public static SendMessageToGroupInvoke(data: iGroupRequestTypes) {
        try {
            groupServer.invoke("SendMessage", data.sender_id, data.group_id, data.value);
        } catch (er) {
            this.dispatchFunction({
                hasError: true,
                error: "Error Sending Message."
            });
            return er;
        }
    }
    public static SendTypingSignal(sender_id: string, group_id: number) {
        try {
            groupServer.invoke("SendTypingSignal", sender_id, group_id);
        } catch (er) {
            this.dispatchFunction({
                hasError: true,
                error: "Server Is Down, Try Again."
            });
            return er;
        }
    }
    public static SendNotificationToUser(
        data: iNotificationTypes,
        DisplayMessage: (obj: iDisplayMessageTypes) => void) {
        try {
            groupServer.invoke("SendNotificationToUser", data);
        } catch (er) {
            DisplayMessage({
                hasError: true,
                error: "Failed To Send Notification."
            });
            return er;
        }
    }
};