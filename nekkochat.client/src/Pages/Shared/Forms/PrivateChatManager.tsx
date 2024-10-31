import { Modal, Button, Container, Col, Row } from 'react-bootstrap';
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
        <div >
            <Modal.Dialog>
                <Modal.Header >
                    <Modal.Title>New Chat</Modal.Title>
                </Modal.Header>

                <Modal.Body >
                    <Container>
                        <Row>
                            <Col xs={8}>
                                <Search
                                    placeholder="Search..."
                                    onChange={(e) => setValue(e)}
                                    onClearClick={() => {
                                        setValue("");
                                        resetSearch();
                                    }} />
                            </Col>
                            <Col>
                                <Button
                                    variant="primary"
                                    onClick={() => {
                                        searchFromList(value, friend);
                                        searchUserByName(value, friend)
                                    }} >Search</Button>
                            </Col>
                        </Row>
                    </Container>

                    <Container style={{ overflowY: "auto", overflowX: "hidden" }}>
                        {searchFriends.length > 0 && <div>
                            <h5>Search Results</h5>
                            {searchFriends.map((el: iUserViewModel, idx: number) => {
                                return <Row key={idx}>
                                    <FriendButton
                                        key={idx}
                                        name={el.userName}
                                        id={el.id}
                                        idx={idx}
                                        item={el}
                                        DisplayMessage={setDisplayInfo} />
                                </Row>
                            })}
                        </div>}

                        <hr />

                        <h5>My Friends</h5>

                        {friend.length > 0 ? friend.map((el: iUserViewModel, idx: number) => {
                            return <Row key={idx}>
                                <FriendButton
                                    key={idx}
                                    name={el.userName}
                                    id={el.id}
                                    idx={idx}
                                    item={el}
                                    DisplayMessage={setDisplayInfo} />
                            </Row>
                        }) : <RegularSkeleton />}

                    </Container>

                </Modal.Body>
            </Modal.Dialog>
        </div>
    );
}
