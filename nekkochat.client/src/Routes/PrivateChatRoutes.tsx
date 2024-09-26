import { BrowserRouter, Route, Routes } from "react-router-dom";
import PrivateChats from "../Pages/PrivateChats/PrivateChats";
import Inbox from "../Pages/PrivateChats/Inbox";
import Chat from "../Pages/PrivateChats/Chat";
import Login from "../Pages/Login/Login";
import Register from "../Pages/Login/Register";

export default function PrivateChatRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/inbox" element={<Inbox />} />
                <Route path="/chats" element={<PrivateChats />} />
                <Route path="/chats/chat/:chat_id" element={<Chat/>} />
                <Route path="/login" element={<Login />} />
                <Route path="/Register" element={<Register/> } />
            </Routes>
        </BrowserRouter>
    );
}

