import { Container, Row, Image, Button, Col } from "react-bootstrap";

import avatar from "../../assets/avatar.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMessage, faTrashCan, faAdd, faStopCircle } from '@fortawesome/free-solid-svg-icons';
export default function Account() {
    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <Image src={avatar} roundedCircle fluid width={250} className="p-2" />
                </Col>
                <Col>
                    <h2>John Doe</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Button className="mx-1">{<FontAwesomeIcon icon={faPhone} />}</Button>
                    <Button className="mx-1">{<FontAwesomeIcon icon={faMessage} />}</Button>
                    <Button className="mx-1">{<FontAwesomeIcon icon={faAdd} />}</Button>
                    <Button variant="danger" className="mx-1">{<FontAwesomeIcon icon={faTrashCan} />}</Button>
                    <Button variant="danger" className="mx-1">{<FontAwesomeIcon icon={faStopCircle} />}</Button>
                </Col>
            </Row>
            <Row>
                <h5>About</h5>
                <p>ipsum ipsum ipsum ipsum ipsumv ipsum v ipsum ipsum ipsum ipsum.</p>
            </Row>
            <Row>
                <h5>Phone Number</h5>
                <p>+1 505-505-5500.</p>
            </Row>
            <Row>
                <h5>Friends</h5>
                <p>50</p>
            </Row>

        </Container>
    );
}