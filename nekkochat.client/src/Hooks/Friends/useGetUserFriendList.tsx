import { useEffect, useState } from "react";
import UserAuthServices from "../../Utils/UserAuthServices";
import { iDisplayMessageTypes, iUserViewModel } from "../../Constants/Types/CommonTypes";

export default function useGetUserFriendList(user_id: string | null, DisplayMessage: (obj: iDisplayMessageTypes) => void) {
    const [value, setValue] = useState('');
    const [friend, setFriend] = useState<iUserViewModel[]>([]);

    const [friendRequest, setFriendRequest] = useState<iUserViewModel[]>([]);

    const getFriendsList = async (id: string) => {

        DisplayMessage({ isLoading: true });

        let res = await UserAuthServices.GetUserFriends(id,"any");
        let fReq = await UserAuthServices.GetUserFriends(id,"requests");
        if (res.success) {
            setFriend([...res.user]);
        DisplayMessage({ isLoading: false });

        } else {
            if (res.internalMessage) return DisplayMessage({
                hasError: true,
                error: res.internalMessage,
                isLoading: true
            });
            DisplayMessage({
                hasError: true,
                error: res.error,
                isLoading: true
            });
        }
        if (fReq.success) {
            setFriendRequest([...fReq.user]);
        } else {
            if (res.internalMessage) return DisplayMessage({
                hasError: true,
                error: res.internalMessage,
                isLoading: true
            });
            DisplayMessage({
                hasError: true,
                error: res.error,
                isLoading: true
            });
        }
    }

    useEffect(() => {
        if (user_id) {
            getFriendsList(user_id);
        }
    }, [user_id]);

    return { friend, friendRequest, value, setValue, setFriend };

}