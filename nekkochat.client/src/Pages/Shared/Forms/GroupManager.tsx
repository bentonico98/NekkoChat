import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { Search, } from '@chatscope/chat-ui-kit-react';
import GroupButton from '../GroupButton';
import { useAppDispatch, useAppSelector } from '../../../Hooks/storeHooks';
import useGetUserFriendList from '../../../Hooks/Friends/useGetUserFriendList';
import { iuserStore, iUserViewModel } from '../../../Constants/Types/CommonTypes';
import { closeModal } from '../../../Store/Slices/userSlice';
import useSearchUserByName from '../../../Hooks/useSearchUserByName';

export default function GroupManager() {

    const user: iuserStore | any = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const { friend, value, setValue } = useGetUserFriendList(user.value.id);
    const { searchFriends, searchFromList, resetSearch } = useSearchUserByName();

    const handleGroupCreation = () => { };

    const handleCancel = () => {
        dispatch(closeModal());
    }
    return (
        <div>
            <Modal.Dialog>
                <Modal.Header>
                    <Modal.Title>New Group</Modal.Title>
                </Modal.Header>

                <Modal.Body>
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
                                    onClick={() => {  searchFromList(value, friend); } } >Search</Button>
                            </Col>
                        </Row>
                    </Container>

                    <Container>
                        {searchFriends.length > 0 && <div>
                            <h5>Search Results</h5>
                            {searchFriends.map((el: iUserViewModel, idx: number) => 
                                <GroupButton
                                    name={el.userName}
                                    idx={idx} />
                            )}
                        </div>}
                   
                        <h5>My Friends</h5>
                        <hr />
                        {friend.length > 0 && friend.map((el: iUserViewModel, idx: number) => {
                            return <GroupButton
                                name={el.userName}
                                idx={idx} />
                        })}
                    </Container>

                </Modal.Body>

                <Modal.Footer>
                    <Button
                        className="mx-1"
                        variant="danger" onClick={handleCancel}>Cancel</Button>
                    <Button variant="primary" onClick={handleGroupCreation}>Create Group</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
}