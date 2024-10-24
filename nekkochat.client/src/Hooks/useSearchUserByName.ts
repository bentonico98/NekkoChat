import { useCallback, useState } from "react";
import UserAuthServices from "../Utils/UserAuthServices";
import { iUserViewModel } from "../Constants/Types/CommonTypes";

export default function useSearchUserByName() {

    const [searchFriends, setSearchFriends] = useState<iUserViewModel[]>([]);

    const handleSearch = async (stringSearch:string) => {
        const res = await UserAuthServices.SearchUserByName(stringSearch);
        if (res.success) {
            setSearchFriends(res.user.user); 
        }
    }
    const handleSearchFromList = useCallback((stringSearch: string, list: iUserViewModel[]) => {
        const filter = list.filter((u: iUserViewModel) => u.userName.includes(stringSearch));
        if (filter.length > 0) {
            setSearchFriends(filter);
        }
    }, []);

    const resetSearch = () => {
        setSearchFriends([]);
    }

    return { searchFriends, searchUserByName: handleSearch, searchFromList: handleSearchFromList, resetSearch };
}