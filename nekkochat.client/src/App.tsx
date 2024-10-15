import './App.css';
import PrivateChatRoutes from "./Routes/PrivateChatRoutes";
import LoginRoutes from "./Routes/LoginRoutes";
import GroupChatRoutes from "./Routes/GroupChatRoutes";

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