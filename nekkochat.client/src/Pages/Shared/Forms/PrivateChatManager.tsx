import { Modal, Button, Container, Col, Row } from 'react-bootstrap';
import { Search } from '@chatscope/chat-ui-kit-react';
import FriendButton from '../FriendButton';
import useGetUserFriendList from '../../../Hooks/Friends/useGetUserFriendList';
import { useAppSelector } from '../../../Hooks/storeHooks';
import { iuserStore, iUserViewModel } from '../../../Constants/Types/CommonTypes';
import useSearchUserByName from '../../../Hooks/useSearchUserByName';

export default function PrivateChatManager() {

    const user: iuserStore | any = useAppSelector((state) => state.user);
    const { friend, value, setValue} = useGetUserFriendList(user.value.id);
    const { searchFriends, searchUserByName, searchFromList, resetSearch } = useSearchUserByName();

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
                                        searchUserByName(value)
                                    }} >Search</Button>
                            </Col>
                        </Row>
                    </Container>

                    <Container style={{ overflowY: "auto", overflowX: "hidden" }}>
                        {searchFriends.length > 0 && <div>
                            <h5>Search Results</h5>
                            {searchFriends.map((el: iUserViewModel, idx: number) => {
                                return <Row>
                                    <FriendButton
                                        name={el.userName}
                                        id={el.id}
                                        idx={idx} />
                                </Row>
                            })}
                        </div>}
                        <hr />
                        <h5>My Friends</h5>
                        {friend.length > 0 && friend.map((el: iUserViewModel, idx: number) => {
                            return <Row>
                                <FriendButton
                                    name={el.userName}
                                    id={el.id}
                                    idx={idx} />
                            </Row>
                        })}
                    </Container>

                </Modal.Body>
            </Modal.Dialog>
        </div>
    );
}

/** */