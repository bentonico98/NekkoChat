import { useEffect, useState } from "react";
import UserAuthServices from "../../Utils/UserAuthServices";
import { iUserViewModel } from "../../Constants/Types/CommonTypes";

export default function useGetUserFriendList(user_id: string | null) {
    const [value, setValue] = useState('');

    const [friend, setFriend] = useState<iUserViewModel[]>([]);

    const getFriendsList = async (id:string) => {
        let res = await UserAuthServices.GetUserFriends(id);
        if (res.success) {
            setFriend([...res.user]);  
        }
    }

    useEffect(() => {
        if (user_id) {
            getFriendsList(user_id);
        }
    }, [user_id]);

    return { friend, value, setValue, setFriend };

}