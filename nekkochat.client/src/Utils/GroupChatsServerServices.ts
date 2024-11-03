import * as signalR from "@microsoft/signalr";
import {  iGroupRequestTypes } from "../Constants/Types/CommonTypes";

export default class PrivateChatsServerServices {

    public static conn = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7198/groupchathub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();

    public static async Start(addToChat: any) {

        if (this.conn.state == "Disconnected") {
            try {
                await this.conn.start().then(() => console.log("Conectado al HUB " + this.conn.connectionId)).catch(err => console.log(err));

                this.conn.onclose(async () => {
                    await this.conn.start().then(() => console.log("Conectado al HUB " + this.conn.connectionId)).catch(err => console.log(err));
                });
                this.conn.on("ReceiveSpecificMessage", (user_id: string, msj: string, username:string) => {
                    addToChat(user_id, username, msj, false);
                });
                this.conn.on("ReceiveTypingSignal", (user: string, username: string) => {
                    addToChat(null, null, null, { typing: true, user_id: user, userN: username });
                });

            } catch (er) {
                console.log(er);
                setTimeout(async () => {
                    if (this.conn.state == "Disconnected") {
                        await this.conn.start().then(() => console.log("Conectado al HUB " + this.conn.connectionId)).catch(err => console.log(err));
                    }
                }, 3000);
            }
        }
        return this.conn.connectionId;
    }
    public static SendMessageToGroupInvoke(data: iGroupRequestTypes) {
        try {
            this.conn.invoke("SendMessage", data.sender_id, data.group_id, data.value);
        } catch (er) {
            console.log(er);
        }
    }
    public static SendTypingSignal(sender_id: string, group_id: number) {
        try {
            this.conn.invoke("SendTypingSignal", sender_id, group_id);
        } catch (er) {
            console.log(er);
        }
    }
};