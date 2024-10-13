import { Modal, Button, Container, Col, Row} from 'react-bootstrap';
import { Search } from '@chatscope/chat-ui-kit-react';
import FriendButton from '../FriendButton';
import useSearchUserByName from '../../../Hooks/useSearchUserByName';

export default function PrivateChatManager() {

    const { friend, setValue, search } = useSearchUserByName();

    return (
        <div>
            <Modal.Dialog>
                <Modal.Header >
                    <Modal.Title>New Chat</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container>
                        <Row>
                            <Col xs={8}>
                                <Search placeholder="Search..." onChange={(e) => setValue(e)} onClearClick={() => setValue("") } />
                            </Col>
                            <Col>
                                <Button variant="primary" onClick={search} >Search</Button> 
                            </Col>
                        </Row>
                    </Container>

                    <hr />

                    <h5>My Friends</h5>
                    {friend.length > 0 && friend.map((el: any, idx: number) => {
                        return <FriendButton name={el.normalizedUserName} id={el.id} idx={idx} />
                    })}
                    <FriendButton name="Friends 1" id="1" idx={1} />
                    <FriendButton name="Friends 2" id="2" idx={2} />
                    <FriendButton name="Friends 3" id="3" idx={3} />
                    <FriendButton name="Friends 4" id="4" idx={4} />
                </Modal.Body>
            </Modal.Dialog>
        </div>
    );
}

/** */