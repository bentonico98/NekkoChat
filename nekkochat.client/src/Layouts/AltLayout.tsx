import { Container } from "react-bootstrap";
import { Outlet } from "react-router-dom";

export default function AltLayout() {
    return (
        <Container style={{ minHeight: "100vh" }}>
            <Outlet/>
        </Container>
    );
}