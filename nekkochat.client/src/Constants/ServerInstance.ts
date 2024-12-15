import * as signalR from "@microsoft/signalr";


export const groupServer: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7198/groupchathub", { withCredentials: false })
    .withAutomaticReconnect()
    .build();

export const privateServer: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7198/privatechathub", { withCredentials: false })
    .withAutomaticReconnect()
    .build();

export const videoServer: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://localhost:7198/videocallhub", { withCredentials: false })
    .withAutomaticReconnect()
    .build();
/*export const groupServer: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://062r207b-7198.use2.devtunnels.ms/groupchathub", { withCredentials: false })
    .withAutomaticReconnect()
    .build();

export const privateServer: signalR.HubConnection = new signalR.HubConnectionBuilder()
    .withUrl("https://062r207b-7198.use2.devtunnels.ms/privatechathub", { withCredentials: false })
    .withAutomaticReconnect()
    .build();*/

export default class ServerInstance {

    public static async StartGroupServer() {

        if (groupServer.state == "Disconnected") {
            await groupServer.start().then(() => console.log("Conectado al HUB " + groupServer.connectionId)).catch(err => console.log(err));

            groupServer.onclose(async () => {
                await groupServer.start().then(() => console.log("Conectado al HUB " + groupServer.connectionId)).catch(err => console.log(err));
            });
        }

        return groupServer;
    }
    public static async StartPrivateServer() {

        if (privateServer.state == "Disconnected") {
            await privateServer.start().then(() => console.log("Conectado al HUB " + privateServer.connectionId)).catch(err => console.log(err));

            privateServer.onclose(async () => {
                await privateServer.start().then(() => console.log("Conectado al HUB " + privateServer.connectionId)).catch(err => console.log(err));
            });
        }

        return privateServer;
    }
}