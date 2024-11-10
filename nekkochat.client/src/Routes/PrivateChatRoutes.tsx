import { BrowserRouter, Route, Routes } from "react-router-dom";

import WelcomePage from "../Pages/Welcome/Index";

import Inbox from "../Pages/PrivateChats/Inbox";

import Login from "../Pages/Login/Login";
import Register from "../Pages/Login/Register";

import InboxGroup from "../Pages/GroupChats/Inbox";

import FriendList from "../Pages/Friend/Index";
import FriendProfile from "../Pages/Friend/Account";
import VideoChats from "../Pages/VideoChats/Index";
import Settings from "../Pages/Settings/Index";

import AppLayout from "../Layouts/AppLayout";
import AltLayout from "../Layouts/AltLayout";


export default function PrivateChatRoutes() {

    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas de la APP */}

                <Route path="/" element={<AppLayout />}>
                    <Route path="inbox" element={<Inbox />} />

                    <Route path="chats">
                        <Route index element={<Inbox />} />
                        <Route path="video" element={<VideoChats />} />
                    </Route>

                    <Route path="groupchats">
                        <Route index element={<InboxGroup />} />
                    </Route>

                    <Route path="friends">
                        <Route index element={<FriendList />} />
                        <Route path=":user_id" element={<FriendProfile />} />
                    </Route>

                    <Route path="/account/:user_id" element={<FriendProfile />} />

                    <Route path="profile" element={<FriendList />} />

                    <Route path="settings" element={<Settings />} />
                </Route>


                {/* Rutas de Autenticacion */}

                <Route path="/" element={<AltLayout />} >
                    <Route index element={<WelcomePage />} />
                    <Route path="login" element={<Login />} />
                    <Route path="register" element={<Register />} />
                </Route>
            </Routes>

        </BrowserRouter>
    );
}
