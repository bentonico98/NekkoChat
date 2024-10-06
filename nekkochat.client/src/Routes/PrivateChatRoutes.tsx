import { BrowserRouter, Route, Routes } from "react-router-dom";

import Inbox from "../Pages/PrivateChats/Inbox";
import Chat from "../Pages/PrivateChats/Chat";

import Login from "../Pages/Login/Login";
import Register from "../Pages/Login/Register";

import InboxGroup from "../Pages/GroupChats/Inbox";
import ChatGroup from "../Pages/GroupChats/Chat";
export default function PrivateChatRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/inbox" element={<Inbox />} />

                <Route path="/chats" element={<Inbox />} />
                <Route path="/chats/chat/:chat_id" element={<Chat />} />

                <Route path="/groupchats" element={<InboxGroup />} />
                <Route path="/groupchats/chat/:chat_id" element={<ChatGroup />} />

                <Route path="/login" element={<Login />} />
                <Route path="/Register" element={<Register />} />
            </Routes>
        </BrowserRouter>
    );
}
