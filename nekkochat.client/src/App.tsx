import './App.css';
import PrivateChatRoutes from "./Routes/PrivateChatRoutes";
import LoginRoutes from "./Routes/LoginRoutes";
import GroupChatRoutes from "./Routes/GroupChatRoutes";
import { BrowserRouter as Router } from 'react-router-dom';
import SimpleSnackbar from './Pages/VideoCall/Components/AnswerButtom';

function App() {

    return (
        <>
            <PrivateChatRoutes />
            <LoginRoutes />
            <GroupChatRoutes />
            <Router>
                <SimpleSnackbar />
            </Router>
        </>
    );
}

export default App;