import { Button, Col, Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faInfoCircle, faPhone } from '@fortawesome/free-solid-svg-icons';
import MessageServicesClient from "../../Utils/MessageServicesClient";
import { useAppSelector } from "../../Hooks/storeHooks";

type incomingProps = {
    name: any,
    id: string,
    idx: number
}
interface userStore {
    value: any,
    modalOpened: boolean
}
export default function FriendButton({ name, id, idx }: incomingProps) {

    const user: userStore = useAppSelector((state) => state.user);

    const navigate = useNavigate();

    const handlePhoneButton = () => { }

    const handleMessageButton = async (sender_id: string, receiver_id: string, msj:string) => {
        const res = await MessageServicesClient.createChat(sender_id, receiver_id, msj);
        if (res.success) {
            navigate(`/chats/chat/${res.chatId}`);
        }
    }

    const handleInfoButton = (id: string) => {
        navigate(`/account/${id}`);
    }

    return (
        <Container key={idx}>
            <Row className="border border-2 rounded pt-2">
                <Col lg={6}>
                    {name}
                </Col>
                <Col>
                    <Button onClick={() => { handlePhoneButton(); } }>{<FontAwesomeIcon icon={faPhone} />}</Button>
                    <Button className="mx-1" onClick={() => { handleMessageButton(user.value.id, id, "Hello"); }}>{<FontAwesomeIcon icon={faMessage} />}</Button>
                    <Button onClick={() => { handleInfoButton(id); }}>{<FontAwesomeIcon icon={faInfoCircle} />}</Button>
                </Col>
            </Row>
        </Container>
    );
}