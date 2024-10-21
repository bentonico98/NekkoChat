import { Button, Col, Container, Row, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faInfoCircle, faPhone } from '@fortawesome/free-solid-svg-icons';
import MessageServicesClient from "../../Utils/MessageServicesClient";
import { useAppSelector } from "../../Hooks/storeHooks";
import avatar from "../../assets/avatar.png";
import { iuserStore } from "../../Constants/Types/CommonTypes";
import { UserState } from "../../Store/Slices/userSlice";

type incomingProps = {
    name: any,
    id: string,
    idx: number
}
export default function FriendButton({ name, id, idx }: incomingProps) {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);

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
                <Col lg={6} className="p-1">
                    <Image src={avatar} roundedCircle fluid width={50} className="mx-2" />
                    {name}
                </Col>
                <Col className="pt-2">
                    <Button onClick={() => { handlePhoneButton(); } }>{<FontAwesomeIcon icon={faPhone} />}</Button>
                    <Button className="mx-1" onClick={() => { handleMessageButton(user.value.id, id, "Hello"); }}>{<FontAwesomeIcon icon={faMessage} />}</Button>
                    <Button onClick={() => { handleInfoButton(id); }}>{<FontAwesomeIcon icon={faInfoCircle} />}</Button>
                </Col>
            </Row>
        </Container>
    );
}