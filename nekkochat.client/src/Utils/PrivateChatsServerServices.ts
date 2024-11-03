import * as signalR from "@microsoft/signalr";
import {  iDisplayMessageTypes, iNotificationTypes, iServerRequestTypes } from "../Constants/Types/CommonTypes";

export default class PrivateChatsServerServices {

    public static conn = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7198/privatechathub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();

    public static async Start(currentUserId: string, addToChat: any, DisplayMessage: (obj: iDisplayMessageTypes) => void) {

        if (this.conn.state == "Disconnected") {
            try {
                await this.conn.start().then(() => console.log("Conectado al HUB " + this.conn.connectionId)).catch(err => console.log(err));

                this.conn.onclose(async () => {
                    await this.conn.start().then(() => console.log("Conectado al HUB " + this.conn.connectionId)).catch(err => console.log(err));
                });

                this.conn.on("ReceiveSpecificMessage", (user_id: string, msj: string) => {
                    addToChat(user_id, msj, false);
                });

                this.conn.on("ReceiveTypingSignal", (user: string) => {
                    addToChat(null, null, {typing: true,user_id:user});
                });

                this.conn.on("ReceiveNotification", (user_id: string) => {
                    if (currentUserId == user_id) {
                        DisplayMessage({
                            hasNotification: true,
                            notification: "+1 New Notification"
                        });
                    }
                });

            } catch (er) {
                setTimeout(async () => {
                    if (this.conn.state == "Disconnected") {
                        await this.conn.start().then(() => console.log("Conectado al HUB " + this.conn.connectionId)).catch(err => console.log(err));
                    }
                }, 3000);
            }
        }
        return this.conn.connectionId;
    }
    public static SendMessageToUserInvoke(data: iServerRequestTypes) {
        try {
            this.conn.invoke("SendMessage", data.sender_id, data.receiver_id, data.value);
        } catch (er) {
            console.log(er);
        }
    }
    public static SendTypingSignal(data: iServerRequestTypes) {
        try {
            this.conn.invoke("SendTypingSignal", data.sender_id,  data.receiver_id);
        } catch (er) {
            console.log(er);
        }
    }

    public static SendNotificationToUser(
        data: iNotificationTypes,
        DisplayMessage: (obj: iDisplayMessageTypes) => void) {
        try {
            this.conn.invoke("SendNotificationToUser", data.user_id, data.operation);
        } catch (er) {
            DisplayMessage({
                hasError: true,
                error: "Failed To Send Notification."
            });
        }
    }
};