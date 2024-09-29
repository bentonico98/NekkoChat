import "./Inbox.css";
import { MainContainer } from '@chatscope/chat-ui-kit-react';

import { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";

import SideBox from "./Components/SideBox";
import ChatMessages from "./Components/ChatMessages";
//import ChatBox from "./Components/ChatBox";
//import MessageServicesClient from "../../Utils/MessageServicesClient";
//import PrivateChatsServerServices from "../../Utils/PrivateChatsServerServices";
import ChatSchema from "../../Schemas/ChatSchema";

import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";
//import { getUserData } from "../../Store/Slices/userSlice";
//import UserAuthServices from "../../Utils/UserAuthServices";
import useSignalServer from "../../Hooks/useSignalServer";
import useGetChatFromUser from "../../Hooks/useGetChatFromUser";
import useGetUser from "../../Hooks/useGetUser";
import { getUserData } from "../../Store/Slices/userSlice";

export default function Inbox() {

    const [isTyping, setIsTyping] = useState({typing:false, user_id: "0"});

    const user = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const addToChat = (user: string, msj: string, { typing, user_id}:any) => {
        if (!msj && !user) {
            setIsTyping({ typing: typing, user_id: user_id });
            setTimeout(() => {
                setIsTyping({ typing: false, user_id: user_id });
            }, 3000);
            return;
        }
        setMessages((c: any) =>
            [...c, new ChatSchema(Math.floor(Math.random()).toString(), user, user, msj, new Date().toJSON(), false)]);
    };
    
    const { conversations, loggedUser, user_id} = useGetUser(user);
    const { connected } = useSignalServer(loggedUser, addToChat);
    const { messages, setMessages, chatID, receiverID, fetchMessage } = useGetChatFromUser(user_id);

    useEffect(() => {
        dispatch(getUserData());
    }, []);
    
    return (
        <MainContainer >
            <SideBox messages={conversations} user={user_id} setCurrentConversation={fetchMessage} />
            <ChatMessages
                messages={messages}
                user={loggedUser}
                connected={connected}
                sender={user_id}
                receiver={receiverID}
                chat={chatID}
                isTyping={isTyping}
            />
        </MainContainer>
    );
}
/**  <h1>NekkoChat -- Inbox</h1>
                <ChatBox connected={connected} sender={user_id} receiver={receiverID} chat={chatID} />
                <h2>Welcome {loggedUser.value.userName}</h2> 
                <div>
               

            </div > */

//const [loggedUser, setLoggedUser] = useState<any>(user);
//const [user_id, setUser_id] = useState<string | null>(loggedUser.value.id ? loggedUser.value.id : null);

//const [conversations, setconversations] = useState<any>([]);
/*const [messages, setMessages] = useState<ChatSchema[]>([]);*/

/*const [currentConvo, setcurrentConvo] = useState<ChatSchema[]>([]);
const [chatID, setChatID] = useState<string>("0");
const [receiverID, setReceiverID] = useState<string>("0"); */

//const [connected, setConnected] = useState<boolean>(false);
//const [conn, setConn] = useState<any>();


/*const sendMessage = async (msj: string, chat_id: number, sender_id: string, receiver_id: string) => {
    if (!msj) return;
    const result = await MessageServicesClient.sendMessageToUser(chat_id, sender_id, receiver_id, msj);
    await PrivateChatsServerServices.SendMessageToUserInvoke(sender_id, receiver_id, msj);
    return result;
};*/


/*useEffect(() => {
    if (UserAuthServices.isAuthenticated() && user_id == null) {
        dispatch(getUserData());
        setLoggedUser((u:any) => u = user);
        setUser_id((c:any) => c = loggedUser.value.id);
    } else if (UserAuthServices.isAuthenticated() && user_id) {
        MessageServicesClient.getAllUsersChats(user_id.toString()).then((res) => {
            setconversations(res);
        });
        setLoggedUser((u: any) => u = user);
        setUser_id((c: any) => c = loggedUser.value.id);
    }
    else {
        navigate("/login");
    }
}, [user_id, loggedUser]);*/

/* const setCurrentConversation = (chat_id: number) => {
     MessageServicesClient.getChatFromUser(chat_id.toString()).then((res) => {
         setcurrentConvo(res);
         var filter = res[0].messages.filter((i: any) => i.user_id != user_id);
         setMessages(res[0].messages);
         setReceiverID(filter[0].user_id);
         setChatID(res[0]._id);
     });
 }*/

//Mantiene la conexion abierta
/*useEffect(() => {
    if (!connected) {
        PrivateChatsServerServices.Start(addToChat).then(async (res) => {
            setConnected(true);
            setConn(res);
            if (user_id) {
                const success = await UserAuthServices.SetConnectionId(user_id, res.connectionId);
                console.log(success);
            }
        });
    } else {
        return;
    }
}, [conn, user_id]);*/


/*[...c,
  {
      id: Math.floor(Math.random()),
      content: msj,
      username: user,
      user_id: user,
      created_at: new Date().toJSON()
  }]);*/