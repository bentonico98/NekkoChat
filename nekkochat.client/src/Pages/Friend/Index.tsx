import { Button, Col, Container, Row } from "react-bootstrap";

import {  Search } from "@chatscope/chat-ui-kit-react";
import FriendButton from "../Shared/FriendButton";
import useSearchUserByName from "../../Hooks/useSearchUserByName";
export default function Index() {

    const { friend, setValue, search } = useSearchUserByName();

    return (
        <Container>
            <h1>Friends List</h1>
            <br />
            <Container>
                <Row>
                    <Col xs={10}>
                        <Search placeholder="Search..." onChange={(e) => setValue(e)} onClearClick={() => setValue("")} />
                    </Col>
                    <Col>
                        <Button variant="primary" onClick={search} >Search</Button>
                    </Col>
                </Row>
            </Container>
            <hr />

            {friend.length > 0 && friend.map((el: any, idx: number) => {
                return<Col xs={3}><FriendButton name={el.normalizedUserName} id={el.id} idx={idx} /></Col>
            })}

            <Col xs={3}>
                <FriendButton name="John Doe" id="1" idx={2 } />
            </Col>
        </Container>
    );
}