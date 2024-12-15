import { useCallback, useState } from "react";
import UserAuthServices from "../Utils/UserAuthServices";
import {
    iDisplayMessageTypes,
    iUserViewModel,
} from "../Constants/Types/CommonTypes";
import UserViewModel from "../Model/UserViewModel";

export default function useSearchUserByName(
    user_id: string,
    DisplayMessage: (obj: iDisplayMessageTypes) => void
) {
    const [searchFriends, setSearchFriends] = useState<iUserViewModel[]>([]);

    const handleSearch = async (
        stringSearch: string,
        friends: iUserViewModel[] = [new UserViewModel()]
    ) => {
        DisplayMessage({ isLoading: true });

        const res = await UserAuthServices.SearchUserByName(stringSearch, user_id);
        if (res.success) {
            const searchRes: iUserViewModel[] = res.user.filter(
                (r: iUserViewModel) => r.id !== user_id
            );
            if (friends.length > 0) {
                searchRes.forEach((el: iUserViewModel) => {
                    friends.forEach((fr: iUserViewModel) => {
                        if (el.id === fr.id) {
                            return (el.isFriend = true);
                        }
                    });
                });
            }
            setSearchFriends(searchRes);
            DisplayMessage({
                hasMsj: true,
                msj: searchRes.length + " Result (s)",
                isLoading: false,
            });
        } else {
            if (res.internalMessage)
                return DisplayMessage({
                    hasError: true,
                    error: res.internalMessage,
                    isLoading: true,
                });
            DisplayMessage({
                hasError: true,
                error: res.error,
                isLoading: true,
            });
        }
    };
    const handleSearchFromList = useCallback(
        (stringSearch: string, list: iUserViewModel[]) => {
            const filter = list.filter((u: iUserViewModel) =>
                u.userName?.includes(stringSearch)
            );
            if (filter.length > 0) {
                setSearchFriends(filter);
            }
        },
        []
    );

    const resetSearch = () => {
        setSearchFriends([]);
    };

    return {
        searchFriends,
        searchUserByName: handleSearch,
        searchFromList: handleSearchFromList,
        resetSearch,
    };
}
