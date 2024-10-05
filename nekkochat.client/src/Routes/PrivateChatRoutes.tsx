import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inbox from "../Pages/PrivateChats/Inbox";
import Chat from "../Pages/PrivateChats/Chat";
import Login from "../Pages/Login/Login";

export default function PrivateChatRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/chats" element={<Inbox />} />
                <Route path="/chats/chat/:chat_id" element={<Chat/>} />
            </Routes>
        </BrowserRouter>
    );
}
