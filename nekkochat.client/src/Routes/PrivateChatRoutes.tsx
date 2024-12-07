import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { VideoCall } from "../Pages/VideoCall/VideoCall";

import WelcomePage from "../Pages/Welcome/Index";

import Inbox from "../Pages/PrivateChats/Inbox";

import Login from "../Pages/Login/Login";
import Register from "../Pages/Login/Register";

import InboxGroup from "../Pages/GroupChats/Inbox";

import FriendList from "../Pages/Friend/Index";
import GroupProfile from "../Pages/Friend/GroupProfile";

import AppLayout from "../Layouts/AppLayout";
import AltLayout from "../Layouts/AltLayout";
import UserAuthServices from "../Utils/UserAuthServices";

export default function PrivateChatRoutes() {
    const isLoggedIn = UserAuthServices.isAuthenticated();

    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas de la APP */}

                <Route path="/" element={isLoggedIn ? <AppLayout /> : <Navigate to="/login"/>}>
                    <Route path="inbox" element={<Inbox />} />

                    <Route path="chats">
                        <Route index element={<Inbox />} />
                        <Route path="videocall" element={<VideoCall />} />
                    </Route>

                    <Route path="groupchats">
                        <Route index element={<InboxGroup />} />
                    </Route>

                    <Route path="friends">
                        <Route index element={<FriendList />} />
                    </Route>

                    <Route path="/group/:user_id" element={<GroupProfile />} />

                    <Route path="profile" element={<FriendList />} />
                </Route>


                {/* Rutas de Autenticacion */}

                <Route path="/" element={!isLoggedIn ? <AltLayout /> : <Navigate to="/inbox" />} >
                    <Route index element={<WelcomePage />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
            </Routes>

        </BrowserRouter>
    );
}
