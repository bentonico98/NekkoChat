import './App.css';
import { VideoCall } from './Pages/VideoCall/VideoCall';
//import PrivateChatRoutes from "./Routes/PrivateChatRoutes";
function App() {
    console.log('Llamando al componente VideoCall');
    return (
        <div>
            <VideoCall />
        </div>
    );
}

export default App;