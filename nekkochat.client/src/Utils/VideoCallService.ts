import * as signalR from "@microsoft/signalr";

export default class VideocallServerServices {

   /* public static conn: signalR.HubConnection = new signalR.HubConnectionBuilder()
        .withUrl("https://localhost:7198/videocallhub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();*/

    public static conn: signalR.HubConnection = new signalR.HubConnectionBuilder() //devtunel
        .withUrl("https://c3b5hzpq-7198.use2.devtunnels.ms/videocallhub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();

    public static async Start() {

        if (this.conn.state == "Disconnected") {
            try {
                await this.conn.start().then(() => console.log("Conectado al HUB " + this.conn.connectionId)).catch(err => console.log(err));

                this.conn.onclose(async () => {
                    await this.conn.start().then(() => console.log("Conectado al HUB " + this.conn.connectionId)).catch(err => console.log(err));
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
        return { connectionId: this.conn.connectionId, connection: this.conn };
    }
    public static async SendOffer(sender_id: string, receiver_id: string, sdp: string) {
        try {
            this.conn.invoke("Offer", sender_id, receiver_id, sdp);
        } catch (er) {
            console.log(er);
        }
    }
    public static async SendAnswer(sender_id: string, receiver_id: string, sdp: string) {
        try {
            this.conn.invoke("Answer", sender_id, receiver_id, sdp);
        } catch (er) {
            console.log(er);
        }
    }
    public static async SendVideoNotification(sender_id: string, receiver_id: string, data: string) {
        try {
            this.conn.invoke("VideoNotification", sender_id, receiver_id, data);
        } catch (er) {
            console.log(er);
        }
    }
    public static async SendOfferVideoNotification(sender_id: string, receiver_id: string, isAccepted: boolean) {
        try {
            this.conn.invoke("OfferVideoNotification", sender_id, receiver_id, isAccepted);
        } catch (er) {
            console.log(er);
        }
    }
    public static async SendConnectedVideoNotification(sender_id: string, receiver_id: string) {
        try {
            this.conn.invoke("ConnectedVideoNotification", sender_id, receiver_id);
        } catch (er) {
            console.log(er);
        }
    }
    public static async SendOfferIceCandidate(sender_id: string, receiver_id: string, candidate: string) {
        try {
            this.conn.invoke("SendOfferIceCandidate", sender_id, receiver_id, candidate);
        } catch (er) {
            console.log(er);
        }
    }
    public static async SendAnswerIceCandidate(sender_id: string, receiver_id: string, candidate: string) {
        try {
            this.conn.invoke("SendAnswerIceCandidate", sender_id, receiver_id, candidate);
        } catch (er) {
            console.log(er);
        }
    }
    public static async SendRenegotiation(sender_id: string, receiver_id: string, sdp:string) {
        try {
            this.conn.invoke("SendRenegotiation", sender_id, receiver_id, sdp);
        } catch (er) {
            console.log(er);
        }
    }
    public static async SendCallExit(sender_id: string, receiver_id: string) {
        try {
            this.conn.invoke("SendCallExit", sender_id, receiver_id);
        } catch (er) {
            console.log(er);
        }
    }
};
