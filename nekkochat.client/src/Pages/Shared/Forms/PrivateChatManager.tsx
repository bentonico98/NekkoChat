import { Modal, Button, Container} from 'react-bootstrap';
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
import { Box, Divider, Stack, Typography } from '@mui/material';

export default function PrivateChatManager() {

    const user: iuserStore | any = useAppSelector((state) => state.user);
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
        setValue } = useGetUserFriendList(user.value.id, setDisplayInfo);

    const {
        searchFriends,
        searchUserByName,
        searchFromList,
        resetSearch } = useSearchUserByName(user.value.id, setDisplayInfo);

    return (
        <Container style={{ width: 500, maxWidth: '100%' }}>
            <Modal.Dialog>
                <Modal.Header >
                    <Modal.Title>New Chat</Modal.Title>
                </Modal.Header>

                <Stack direction="row" spacing={2}>
                    <Box sx={{ width: "100%", maxWidth: '100%' }}>
                        <Search
                            placeholder="Search..."
                            onChange={(e) => setValue(e)}
                            onClearClick={() => {
                                setValue("");
                                resetSearch();
                            }} />
                    </Box>

                    <Box>
                        <Button
                            variant="primary"
                            onClick={() => {
                                searchFromList(value, friend);
                                searchUserByName(value, friend)
                            }} >Search</Button>
                    </Box>
                </Stack>

                <Modal.Body >
                    <Container style={{ overflowY: "auto", overflowX: "hidden" }}>
                        {searchFriends.length > 0 && <div>
                            <Typography variant="h5" className="my-2">Search Results</Typography>
                            {searchFriends.map((el: iUserViewModel, idx: number) => {
                                return <FriendButton
                                        key={idx}
                                        id={el.id}
                                        idx={idx}
                                        item={el}
                                        DisplayMessage={setDisplayInfo} />
                            })}
                        </div>}

                        <Divider />

                        <Typography variant="h6" className="my-2">My Friends</Typography>
                        {friend.length > 0 ? friend.map((el: iUserViewModel, idx: number) => {
                            return <FriendButton
                                    key={idx}
                                    id={el.id}
                                    idx={idx}
                                    item={el}
                                    DisplayMessage={setDisplayInfo} />
                        }) : <RegularSkeleton />}
                    </Container>
                </Modal.Body>

            </Modal.Dialog>
        </Container>
    );
}
