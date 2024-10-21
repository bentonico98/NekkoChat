import { Container } from "react-bootstrap";
import NekkoNavbar from "../Pages/Shared/NekkoNavbar";
import { Outlet } from "react-router-dom";

export default function AppLayout() {

    return (
        <>
            <NekkoNavbar />
            <Container style={{ minHeight: "100vh", minWidth:"100%" }}>
                <Outlet />
            </Container>
        </>
    );
}