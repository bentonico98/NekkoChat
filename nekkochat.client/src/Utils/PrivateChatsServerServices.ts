import * as signalR from "@microsoft/signalr";

export default class PrivateChatsServerServices {

    public static conn = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7198/privatechathub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();

    public static async Start(addToChat: any) {
        

        try {
            await this.conn.start().then(() => console.log("Conectado al HUB")).catch(err => console.log(err));

            this.conn.onclose(async () => {
                await this.conn.start().then(() => console.log("Conectado al HUB")).catch(err => console.log(err));
            });
            this.conn.on("ReceiveMessage", (username: string, message: string) => {
                addToChat(username, message);
            });

        } catch (er) {
            console.log(er);
            setTimeout(async () => {
                if (this.conn.state == "Disconnected") {
                    await this.conn.start().then(() => console.log("Conectado al HUB")).catch(err => console.log(err));
                }
            }, 3000);
        }
        return this.conn;
    }
    public static SendMessageInvoke(msj: string, chat_id: number) {
        try {
            this.conn.invoke("SendMessage", `${chat_id}`, msj);
        } catch (er) {
            console.log(er);
        }
    }
};