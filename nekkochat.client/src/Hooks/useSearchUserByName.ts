import { useState } from "react";
import UserAuthServices from "../Utils/UserAuthServices";

export default function useSearchUserByName() {
    const [value, setValue] = useState('');

    const [friend, setFriend] = useState([]);

    const handleSearch = async () => {
        const res = await UserAuthServices.SearchUserByName(value);
        if (res.success) {
            setFriend(res.user.user);
        }
    }

    return { friend, setValue, search: handleSearch };
}