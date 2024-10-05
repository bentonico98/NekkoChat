import * as signalR from "@microsoft/signalr";

export default class PrivateChatsServerServices {

    public static conn = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7198/privatechathub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();

    public static async Start(addToChat: any) {

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
                    console.log(user);
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
    public static SendMessageToUserInvoke(sender_id: string, receiver_id: string, msj: string) {
        try {
            this.conn.invoke("SendMessage", sender_id, receiver_id, msj);
        } catch (er) {
            console.log(er);
        }
    }
    public static SendTypingSignal(sender_id:string, receiver_id: string) {
        try {
            this.conn.invoke("SendTypingSignal", sender_id,  receiver_id);
        } catch (er) {
            console.log(er);
        }
    }
};