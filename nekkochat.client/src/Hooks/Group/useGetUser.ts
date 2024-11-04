import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserAuthServices from "../../Utils/UserAuthServices";
import MessageServicesClient from "../../Utils/MessageServicesClient";
import { iConversationClusterProps, iServeResponseTypes, iuserStore } from "../../Constants/Types/CommonTypes";
import { UserState } from "../../Store/Slices/userSlice";

export default function useGetUser(user: UserState |iuserStore | any ) {
    const navigate = useNavigate();

    const [loggedUser, setLoggedUser] = useState<iuserStore | any>(user);
    const [conversations, setconversations] = useState<iConversationClusterProps[]>([]);
    const [user_id, setUser_id] = useState<string>(user.value?.id ? user.value?.id : "0");
    
    const dispatchUser = () => {
        if (UserAuthServices.isAuthenticated() && loggedUser == null) {
            setLoggedUser(user);
            setUser_id(loggedUser!.value.id);
        } else if (UserAuthServices.isAuthenticated() && loggedUser) {
            MessageServicesClient.getAllGroupsChats(loggedUser.value.id).then((res: iServeResponseTypes) => {
                if (res.success) {
                    setconversations(res.user);
                }

            });
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

    return { conversations, loggedUser, user_id };
}

//dispatch(getUserData());
//const dispatch = useAppDispatch();
