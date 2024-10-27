import { useCallback, useState } from "react";
import UserAuthServices from "../Utils/UserAuthServices";
import { iUserViewModel } from "../Constants/Types/CommonTypes";
import UserViewModel from "../Model/UserViewModel";

export default function useSearchUserByName() {

    const [searchFriends, setSearchFriends] = useState<iUserViewModel[]>([]);

    const handleSearch = async (stringSearch: string, friends: iUserViewModel[] = [new UserViewModel()]) => {
        const res = await UserAuthServices.SearchUserByName(stringSearch);
        if (res.success) {
            let searchRes: iUserViewModel[] = res.user.user;
            if (friends.length > 0) {
                searchRes.forEach((el: iUserViewModel) => {
                    friends.forEach((fr: iUserViewModel) => {
                        if (el.id === fr.id) {
                            return el.isFriend = true;
                        }
                    });
                });
            }

            setSearchFriends(searchRes);
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