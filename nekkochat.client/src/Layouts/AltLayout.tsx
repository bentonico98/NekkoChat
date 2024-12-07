//import { useLayoutEffect } from "react";
import { Outlet } from "react-router-dom";
//import UserAuthServices from "../Utils/UserAuthServices";

export default function AltLayout() {
    return (
        <>
            <Outlet />
        </>
    );
}