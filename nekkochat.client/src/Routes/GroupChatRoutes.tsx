import { BrowserRouter, Route, Routes } from "react-router-dom";
import Inbox from "../Pages/GroupChats/Inbox";

export default function GroupChatRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/groupchats" element={<Inbox />} />
            </Routes>
        </BrowserRouter>
    );
}