import './App.css';
import { VideoCall } from './Pages/VideoCall/VideoCall';
//import PrivateChatRoutes from "./Routes/PrivateChatRoutes";
function App() {
    console.log('Llamando al componente VideoCall');
    return (
        <>
            <VideoCall />
        </>
    );
}

export default App;