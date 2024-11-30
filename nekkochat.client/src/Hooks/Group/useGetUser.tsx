import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAuthServices from "../../Utils/UserAuthServices";
import MessageServicesClient from "../../Utils/MessageServicesClient";
import { iConversationClusterProps, iDisplayMessageTypes, iuserStore } from "../../Constants/Types/CommonTypes";
import { UserState } from "../../Store/Slices/userSlice";

export default function useGetUser(user: UserState | iuserStore | any, DisplayMessage: (obj: iDisplayMessageTypes) => void) {
    const navigate = useNavigate();

    const [loggedUser, setLoggedUser] = useState<iuserStore | any>(user);
    const [conversations, setconversations] = useState<iConversationClusterProps[]>([]);
    const [user_id, setUser_id] = useState<string>(user.value?.id ? user.value?.id : "0");

    const dispatchUser = async () => {
        if (UserAuthServices.isAuthenticated() && loggedUser == null) {
            setLoggedUser(user);
            setUser_id(loggedUser!.value.id);
        } else if (UserAuthServices.isAuthenticated() && loggedUser) {
            DisplayMessage({ isLoading: true });

            const res = await MessageServicesClient.getAllGroupsChats(loggedUser.value.id);
            if (res.success) {
                setconversations(res.user);
            } else {
                if (res.internalMessage) return DisplayMessage({
                    hasError: true,
                    error: res.internalMessage,
                    isLoading: false
                });
                DisplayMessage({
                    hasError: true,
                    error: res.error,
                    isLoading: false
                });
            }
            setLoggedUser(user);
            setUser_id(loggedUser.value.id);
        }
        else {
            navigate("/login");
        }
    }
    useEffect(() => {
        dispatchUser();
    }, [loggedUser, user_id]);

    return { conversations, loggedUser, user_id, refresh: dispatchUser };
}