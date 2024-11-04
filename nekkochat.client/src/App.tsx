import './App.css';
import PrivateChatRoutes from "./Routes/PrivateChatRoutes";
import { BrowserRouter as Router } from 'react-router-dom';
import SimpleSnackbar from './Pages/VideoCall/Components/AnswerButtom';

function App() {

    return (
        <>
            <PrivateChatRoutes />
            <Router>
                    <SimpleSnackbar />
                </Router>
        </>
    );
}

export default App;