import { Modal, Button, Container } from 'react-bootstrap';
import { Search } from '@chatscope/chat-ui-kit-react';
import FriendButton from '../FriendButton';
import { useAppDispatch, useAppSelector } from '../../../Hooks/storeHooks';
import { iuserStore, iUserViewModel } from '../../../Constants/Types/CommonTypes';
import useGetUserFriendList from '../../../Hooks/Friends/useGetUserFriendList';
import useSearchUserByName from '../../../Hooks/useSearchUserByName';
import useDisplayMessage from '../../../Hooks/useDisplayMessage';
import { useEffect } from 'react';
import { toggleErrorModal, toggleLoading, toggleMsjModal, toggleNotification } from '../../../Store/Slices/userSlice';
import RegularSkeleton from '../Skeletons/RegularSkeleton';
import { Box, Divider, Typography } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

export default function PrivateChatManager() {

    const user: iuserStore = useAppSelector((state) => state.user);
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

    const {
        friend,
        value,
        setValue } = useGetUserFriendList(user.value?.id || '0', setDisplayInfo);

    const {
        searchFriends,
        searchUserByName,
        searchFromList,
        resetSearch } = useSearchUserByName(user.value?.id || '0', setDisplayInfo);

    return (
        <Container style={{ width: '90vw', maxWidth: '100%' }}>
            <Modal.Dialog>
                <Modal.Header >
                    <Modal.Title>New Chat</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container>
                        <Box className="Two-Row-Container mx-2">
                            <Search
                                className="Two-Row-Container-First-Item"
                                placeholder="Search..."
                                onChange={(e) => setValue(e)}
                                onClearClick={() => {
                                    setValue("");
                                    resetSearch();
                                }} />

                            <Button
                                className="Two-Row-Container-Second-Item"
                                variant="primary"
                                onClick={() => {
                                    searchFromList(value, friend);
                                    searchUserByName(value, friend)
                                }} >{<SearchIcon />}</Button>
                        </Box>
                        {searchFriends.length > 0 && <Box className="Three-Row-Container">
                            <Typography variant="h5" className="my-2">Search Results</Typography>
                            {searchFriends.map((el: iUserViewModel, idx: number) => {
                                return <FriendButton
                                    key={idx}
                                    idx={idx}
                                    item={el}
                                    DisplayMessage={setDisplayInfo}
                                    searchSafe={false} />
                            })}
                        </Box>}

                        <Divider />

                        <Typography variant="h6" className="my-2">My Friends</Typography><Box className="Three-Row-Container">
                            {friend.length > 0 ? friend.map((el: iUserViewModel, idx: number) => {
                                return <FriendButton
                                    key={idx}
                                    idx={idx}
                                    item={el}
                                    DisplayMessage={setDisplayInfo}
                                    searchSafe={false} />
                            }) : <RegularSkeleton />}
                        </Box>
                    </Container>
                </Modal.Body>
            </Modal.Dialog>
        </Container>
    );
}
