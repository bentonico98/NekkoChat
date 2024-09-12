import {  useState } from "react";
import "../PrivateChats.css";
export default function ChatBox({ sendMessage, connected}: any) {

    const [text, setText] = useState<any>("");

    return (
        <form onSubmit={(e) => { e.preventDefault(); sendMessage(text, 1, 1, 2); setText(""); }} className="actionContainer">
            <textarea rows={10} cols={20} placeholder="Type Message" value={text} onChange={(e) => { setText(e.target.value); }} ></textarea>
            <button type="submit" disabled={!connected} >Send Message</button>
        </form>
    );
}