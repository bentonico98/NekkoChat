import { useEffect, useState } from "react";
import UserAuthServices from "../../Utils/UserAuthServices";
import { iUserViewModel } from "../../Constants/Types/CommonTypes";

export default function useGetUserFriendList(user_id: string | null) {
    const [value, setValue] = useState('');

    const [friend, setFriend] = useState<iUserViewModel[]>([]);

    const [friendRequest, setFriendRequest] = useState<iUserViewModel[]>([]);

    const getFriendsList = async (id:string) => {
        let res = await UserAuthServices.GetUserFriends(id,"any");
        let fReq = await UserAuthServices.GetUserFriends(id,"requests");
        if (res.success) {
            setFriend([...res.user]);  
        }
        if (fReq.success) {
            setFriendRequest([...fReq.user]);
        }
    }

    useEffect(() => {
        if (user_id) {
            getFriendsList(user_id);
        }
    }, [user_id]);

    return { friend, friendRequest, value, setValue, setFriend };

}