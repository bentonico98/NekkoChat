import { Modal, Button, Container, Row, Col } from 'react-bootstrap';
import { Search,  } from '@chatscope/chat-ui-kit-react';
import GroupButton from '../GroupButton';
import useSearchUserByName from '../../../Hooks/useSearchUserByName';

export default function GroupManager() {

    const { friend, setValue, search } = useSearchUserByName();

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
                                <Search placeholder="Search..." onChange={(e) => setValue(e)} onClearClick={() => setValue("")} />
                            </Col>
                            <Col>
                                <Button variant="primary" onClick={search} >Search</Button>
                            </Col>
                        </Row>
                    </Container>

                    <hr />

                    {friend.length > 0 && friend.map((el: any, idx: number) => {
                        return <GroupButton name={el.normalizedUserName} idx={idx} />
                    })}
                    <GroupButton name="John Doe" idx={1} />
                    <GroupButton name="John Smith" idx={2} />
                    <GroupButton name="John Clark" idx={3} />
                </Modal.Body>

                <Modal.Footer>
                    <Button className="mx-1" variant="danger">Cancel</Button>
                    <Button variant="primary">Create Group</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </div>
    );
}

/** */