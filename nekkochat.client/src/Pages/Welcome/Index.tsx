import { Container } from "react-bootstrap";
import { Link } from "react-router-dom"

export default function Index() {
    return (
        <Container>
            <h1>WELCOME TO NEKKOCHAT</h1>
            <Link to="/inbox">Inbox</Link>
        </Container>
    );
}