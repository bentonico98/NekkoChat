import { Container } from "react-bootstrap";
import NekkoNavbar from "../Pages/Shared/NekkoNavbar";
import { Outlet } from "react-router-dom";
import RegularSnackbar from "../Pages/Shared/RegularSnackbar";
import ErrorSnackbar from "../Pages/Shared/ErrorSnackbar";
import NotificationSnackbar from "../Pages/Shared/NotificationSnackbar";
import NekkoSpinner from "../Pages/Shared/Skeletons/NekkoSpinner";

export default function AppLayout() {

    return (
        <>
            <NekkoNavbar />
            <Container style={{ minHeight: "100vh", minWidth:"100%" }}>
                <Outlet />
                <NekkoSpinner />
            </Container>
            <RegularSnackbar />
            <ErrorSnackbar />
            <NotificationSnackbar />
        </>
    );
}