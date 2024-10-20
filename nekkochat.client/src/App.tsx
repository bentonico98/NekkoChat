import { Container } from 'react-bootstrap';
import './App.css';
import NekkoNavbar from './Pages/Shared/NekkoNavbar';
import PrivateChatRoutes from "./Routes/PrivateChatRoutes";

function App() {
    
    return (
        <>
            <NekkoNavbar />
            <Container style={{ minHeight: "100vh" }}>
                <PrivateChatRoutes />
            </Container>
        </>
    );
}

export default App;