import { useEffect, useState } from "react";
import MessageServicesClient from "../Utils/MessageServicesClient";
import { useNavigate } from "react-router-dom";
import UserAuthServices from "../Utils/UserAuthServices";
//import { useAppDispatch } from "./storeHooks";
//import { getUserData } from "../Store/Slices/userSlice";

export default function useGetUser(user: any) {
    const navigate = useNavigate();

    const [loggedUser, setLoggedUser] = useState<any>(user);
    const [conversations, setconversations] = useState<any>([]);
    const [user_id, setUser_id] = useState<string>(user.value.id ? user.value.id : null);
    
    const dispatchUser = () => {
        if (UserAuthServices.isAuthenticated() && loggedUser == null) {
            setLoggedUser((u: any) => u = user);
            setUser_id((c: any) => c = loggedUser.value.id);
        } else if (UserAuthServices.isAuthenticated() && loggedUser) {
            MessageServicesClient.getAllUsersChats(loggedUser.value.id).then((res) => {
                setconversations(res);
            });
            setLoggedUser((u: any) => u = user);
            setUser_id((c: any) => c = loggedUser.value.id);
        }
        else {
            navigate("/login");
        }
    }
    useEffect(() => {
        dispatchUser();
    }, [loggedUser, user_id]);

    return { conversations, loggedUser, user_id };
}

//dispatch(getUserData());
//const dispatch = useAppDispatch();
