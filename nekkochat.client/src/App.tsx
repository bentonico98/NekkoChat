import './App.css';
import SimpleSnackbar from './Pages/VideoCall/Components/AnswerButtom';
import PrivateChatRoutes from './Routes/PrivateChatRoutes';
import { BrowserRouter as Router } from 'react-router-dom';

//import PrivateChatRoutes from "./Routes/PrivateChatRoutes";
function App() {
    console.log('Llamando al componente VideoCall');
    return (
        <>
            <PrivateChatRoutes/>
            <Router>
                <SimpleSnackbar />
            </Router>

        </>
    );
}

export default App;