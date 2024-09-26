import {  useState } from "react";
import "../PrivateChats.css";
import MessageServicesClient from "../../../Utils/MessageServicesClient";
export default function ChatBox({ connected, sender, receiver, chat}: any) {

    const [text, setText] = useState<any>("");
    return (
        <form onSubmit={async (e) => { e.preventDefault(); await MessageServicesClient.sendMessageToUser(chat, sender, receiver, text); setText(""); }} className="actionContainer">
            <textarea rows={10} cols={20} placeholder="Type Message" value={text} onChange={(e) => { setText(e.target.value); }} ></textarea>
            <button type="submit" disabled={!connected} >Send Message</button>
        </form>
    );
}