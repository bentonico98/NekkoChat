import { useParams } from "react-router-dom";
import { useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import { MainContainer } from '@chatscope/chat-ui-kit-react';

import ChatMessages from "./Components/ChatMessages";
import ChatBox from "./Components/ChatBox";
import "./PrivateChats.css";
//import MessageServicesClient from "../../Utils/MessageServicesClient";
//import PrivateChatsServerServices from "../../Utils/PrivateChatsServerServices";
//import ChatSchema from "../../Schemas/ChatSchema";
//import UserAuthServices from "../../Utils/UserAuthServices";
import { useAppSelector, useAppDispatch } from "../../Hooks/storeHooks";
import { getUserData } from "../../Store/Slices/userSlice";
import ChatSchema from "../../Schemas/ChatSchema";
import useGetChatFromUser from "../../Hooks/useGetChatFromUser";
import useGetUser from "../../Hooks/useGetUser";
import useSignalServer from "../../Hooks/useSignalServer";
export default function Chat() {
    const { chat_id } = useParams();

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const addToChat = (user: string, msj: string) => {
        if (!msj) return;
        setMessages((c: any) =>
            [...c, new ChatSchema(Math.floor(Math.random()).toString(), user, user, msj, new Date().toJSON(), false)]);
    };

    const { loggedUser, user_id } = useGetUser(user);
    const { connected } = useSignalServer(loggedUser, addToChat);
    const { messages, setMessages, receiverID, fetchMessage } = useGetChatFromUser(user_id);

    useEffect(() => {
        dispatch(getUserData());
        fetchMessage(chat_id);
    }, []);

    return (
        <MainContainer>
            <ChatMessages messages={messages} user={loggedUser} connected={connected} sender={user_id} receiver={receiverID} chat={chat_id} />
        </MainContainer>
        
    );
};



/*
<div className="mainContainer">
            <h1>Chat: {chat_id}</h1>

            <ChatMessages messages={messages} />
            <ChatBox connected={connected} sender={user_id} receiver={receiverID} chat={chat_id} />

           
        </div >


const sendMessage = async (msj: string, chat_id: number, sender_id: string, receiver_id: string) => {
await MessageServicesClient.sendMessageToUser(chat_id, sender_id, receiver_id, msj);
return { sender_id: sender_id, receiver_id: receiver_id };
};*/

/*[...c,
{
    id: Math.floor(Math.random()),
    content: msj,
    username: user,
    user_id: user,
    created_at: new Date().toJSON()
}]);*/

/*useEffect(() => {
MessageServicesClient.getChatFromUser(chat_id!.toString()).then((res) => {
setMessages(res[0].messages);
var filter = res[0].messages.filter((i: any) => i.user_id != user_id);
setReceiverID(filter[0].user_id);
});

if (UserAuthServices.isAuthenticated() && user_id == null) {
dispatch(getUserData());
setLoggedUser((u: any) => u = user);
setUser_id((c: any) => c = loggedUser.value.id);
} else if (UserAuthServices.isAuthenticated() && user_id) {
setLoggedUser((u: any) => u = user);
setUser_id((c: any) => c = loggedUser.value.id);
}
else {
navigate("/login");
}
}, [user_id, loggedUser]);*/

//Mantiene la conexion abierta
/*useEffect(() => {
    if (!connected) {
        PrivateChatsServerServices.Start(addToChat).then(async (res) => {
            setConnected(true);
            console.log(user_id);
            if (user_id) {
                const success = await UserAuthServices.SetConnectionId(user_id, res.connectionId);
                console.log(success);
            }
            return res;
        });
    } else {
        return;
    }
}, [user_id, connected]);
console.log(user_id);*/


/*const [loggedUser, setLoggedUser] = useState<any>(user);
const [user_id, setUser_id] = useState<string | null>(loggedUser.value.id ? loggedUser.value.id : null);*/

/*const [messages, setMessages] = useState<any>([]);
const [connected, setConnected] = useState<boolean>(false);
const [receiverID, setReceiverID] = useState<string>("0");*/

//const navigate = useNavigate();
