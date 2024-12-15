import { useEffect, useState } from "react";
import MessageServicesClient from "../Utils/MessageServicesClient";
import { useNavigate } from "react-router-dom";
import UserAuthServices from "../Utils/UserAuthServices";
import { iConversationClusterProps, iDisplayMessageTypes, iuserStore } from "../Constants/Types/CommonTypes";

export default function useGetUser(user: iuserStore , type: string, DisplayMessage: (obj: iDisplayMessageTypes) => void) {
    const navigate = useNavigate();

    const [loggedUser, setLoggedUser] = useState<iuserStore>(user);
    const [conversations, setconversations] = useState<iConversationClusterProps[]>([]);
    const [user_id, setUser_id] = useState<string>(user.value.id ? user.value.id : "0");
    
    const dispatchUser = () => {
        if (UserAuthServices.isAuthenticated() && loggedUser == null) {
            setLoggedUser(user);
            setUser_id(user.value?.id || '0');
        } else if (UserAuthServices.isAuthenticated() && loggedUser) {
            DisplayMessage({ isLoading: true });

            MessageServicesClient.getAllUsersChats(user.value?.id || '0', type).then((res) => {
                if (res.success) {
                    setconversations(res.user);
                    DisplayMessage({ isLoading: false });
                } else {
                    if (res.internalMessage) return DisplayMessage({
                        hasError:true,
                        error: res.internalMessage,
                        isLoading: false
                    });
                    DisplayMessage({
                        hasError: true,
                        error: res.error,
                        isLoading: false
                    });
                }
            });
            setLoggedUser(user);
            setUser_id(user.value?.id || '0');
        }
        else {
            navigate("/login");
        }
    }
    useEffect(() => {
        dispatchUser();
    }, [loggedUser, user_id, type]);

    return { conversations, loggedUser, user_id, refresh: dispatchUser  };
}