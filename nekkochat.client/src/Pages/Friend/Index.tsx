import { Button, Container } from "react-bootstrap";

import { Search } from "@chatscope/chat-ui-kit-react";
import FriendButton from "../Shared/FriendButton";
import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";
import { iuserStore, iUserViewModel } from "../../Constants/Types/CommonTypes";
import { toggleErrorModal, toggleLoading, toggleMsjModal, toggleNotification, UserState } from "../../Store/Slices/userSlice";
import useGetUserFriendList from "../../Hooks/Friends/useGetUserFriendList";
import useSearchUserByName from "../../Hooks/useSearchUserByName";
import useDisplayMessage from "../../Hooks/useDisplayMessage";
import { useEffect } from "react";
import RegularSkeleton from "../Shared/Skeletons/RegularSkeleton";
import { Box, Divider, Typography } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

export default function Index() {
    const dispatch = useAppDispatch();

    const { displayInfo, setDisplayInfo } = useDisplayMessage();

    useEffect(() => {
        if (displayInfo.hasError) {
            dispatch(toggleErrorModal({ status: true, message: displayInfo.error }));
        }
        if (displayInfo.hasMsj) {
            dispatch(toggleMsjModal({ status: true, message: displayInfo.msj }));
        }
        if (displayInfo.hasNotification) {
            dispatch(toggleNotification({ status: true, message: displayInfo.notification }));
        }
        dispatch(toggleLoading(displayInfo.isLoading));

    }, [displayInfo]);

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);

    const {
        friend,
        friendRequest,
        value,
        setValue } = useGetUserFriendList(user.value.id, setDisplayInfo);

    const {
        searchFriends,
        searchFromList,
        resetSearch } = useSearchUserByName(user.value.id, setDisplayInfo);

    return (
        <Container className="text-center fluidContainer">
            <Typography variant="h3" className="my-4">Friends List</Typography>

            <Divider />

            <Box className="Two-Row-Container">
                <Search
                    className="Two-Row-Container-First-Item"
                    placeholder="Search..." onChange={(e) => setValue(e)}
                    onClearClick={() => { setValue(""); resetSearch(); }} />
                <Button
                    className="Two-Row-Container-Second-Item"
                    variant="primary"
                    onClick={() => { searchFromList(value, friend); }} >{<SearchIcon />}</Button>
            </Box>

            {friendRequest.length > 0 && <Box>
                <Typography variant="h3" className="my-2">Pending Friend Requests</Typography>
                <Box className="Three-Row-Container" >
                    {friendRequest.map((el: iUserViewModel, idx: number) => {
                        return <FriendButton
                            key={idx}
                            id={el.id}
                            idx={idx}
                            item={el}
                            DisplayMessage={setDisplayInfo} />
                    })}
                </Box>
                <Divider />
            </Box>}

            {searchFriends.length > 0 && <Box>
                <Typography variant="h5" className="my-3">Search Results</Typography>
                <Box className="Three-Row-Container" >
                    {searchFriends.map((el: iUserViewModel, idx: number) => {
                        return <FriendButton
                            key={idx}
                            id={el.id}
                            idx={idx}
                            item={el}
                            DisplayMessage={setDisplayInfo} />
                    })}
                </Box>
                <Divider />
            </Box>}

            <Typography variant="h5" className="my-3">My Friends</Typography>
            <Box className="Three-Row-Container">
                {friend.length > 0 ? friend.map((el: iUserViewModel, idx: number) => {
                    return <FriendButton
                        key={idx}
                        id={el.id}
                        idx={idx}
                        item={el}
                        DisplayMessage={setDisplayInfo} />
                })
                    :
                    <RegularSkeleton />}
            </Box>

        </Container>
    );
}