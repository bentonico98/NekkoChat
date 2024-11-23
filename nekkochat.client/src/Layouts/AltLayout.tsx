import { useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";
import UserAuthServices from "../Utils/UserAuthServices";

export default function AltLayout() {
    const navigate = () => {
        window.location.href = "/inbox"
    }

    useLayoutEffect(() => {
        if (UserAuthServices.isAuthenticated()) {
            navigate();
        }
    }, []);

    return (
        <Outlet />
    );
}