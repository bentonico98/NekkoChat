import { Button, Col, Container, Row, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faInfoCircle, faPhone, faAdd, faCheck, faCancel } from '@fortawesome/free-solid-svg-icons';
import MessageServicesClient from "../../Utils/MessageServicesClient";
import { useAppSelector } from "../../Hooks/storeHooks";
import avatar from "../../assets/avatar.png";
import { iuserStore, iUserViewModel } from "../../Constants/Types/CommonTypes";
import { UserState } from "../../Store/Slices/userSlice";
import FirstLetterUpperCase from "../../Utils/FirstLetterUpperCase";
import UserAuthServices from "../../Utils/UserAuthServices";

type incomingProps = {
    item?: iUserViewModel
    name: any,
    id: string,
    idx: number
}
export default function FriendButton({ name, id, idx, item }: incomingProps) {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);

    const navigate = useNavigate();

    const handlePhoneButton = () => { }

    const handleManageFriendButton = async (
        operation: string = 'add',
        receiver_id: string,
        sender_id: string) => {

        if (receiver_id == null || sender_id == null) return false;
        if (receiver_id.length <= 0 || sender_id.length <= 0) return false;

        if (operation === "accept") {
            const res = await UserAuthServices.GetManageFriendRequest({ operation, sender_id, receiver_id });
            console.log(res);
            return res.success;
        } else if (operation === "decline") {
            const res = await UserAuthServices.GetManageFriendRequest({ operation, sender_id, receiver_id });
            console.log(res);
            return res.success;
        } else {
            const res = await UserAuthServices.GetSendFriendRequest({ sender_id, receiver_id });
            console.log(res);
            return res.success;
        }
    }

    const handleMessageButton = async (sender_id: string, receiver_id: string, msj: string) => {
        const res = await MessageServicesClient.createChat({
            sender_id,
            receiver_id,
            value: msj
        });
        if (res.success) {
            navigate(`/chats/chat/${res.chatId}`);
        }
    }

    const handleInfoButton = (id: string) => {
        navigate(`/account/${id}`);
    }

    return (
        <Container key={idx}>
            <Row className={`border border-2 rounded pt-2 ${!item!.isFriend && "bg-secondary"}`}>
                <Col lg={6} className="p-1">
                    <Image src={avatar} roundedCircle fluid width={50} className="mx-2" />
                    {FirstLetterUpperCase(name)}
                </Col>
                <Col className="pt-2">
                    <Row>
                        {!item!.isFriend ?
                            <Col>
                                {item!.isSender ?
                                    <Button
                                        variant="info"
                                        onClick={() => { handleManageFriendButton("accept", item!.id, user.value.id); }}>{
                                            <FontAwesomeIcon icon={faCheck} />}
                                    </Button>
                                    :
                                    <Button
                                        variant="danger"
                                        className="mx-1"
                                        onClick={() => { handleManageFriendButton("add", item!.id, user.value.id); }}>{
                                            <FontAwesomeIcon icon={faAdd} />}
                                    </Button>}
                                {item!.isSender ?
                                    <Button
                                        variant="danger"
                                        className="mx-1"
                                        onClick={() => { handleManageFriendButton("decline", item!.id, user.value.id); }}>{
                                            <FontAwesomeIcon icon={faCancel} />}
                                    </Button> : 
                                    <Button
                                        className="mx-1"
                                        onClick={() => {
                                            handleMessageButton(user.value.id, id, "Hello");
                                        }}>{
                                            <FontAwesomeIcon icon={faMessage} />
                                        }</Button>
                                }
                                <Button
                                    onClick={() => {
                                        handleInfoButton(id);
                                    }}>{
                                        <FontAwesomeIcon icon={faInfoCircle} />}
                                </Button>
                            </Col> : <Col>
                                <Button onClick={() => { handlePhoneButton(); }}>{<FontAwesomeIcon icon={faPhone} />}</Button>
                                <Button className="mx-1" onClick={() => { handleMessageButton(user.value.id, id, "Hello"); }}>{<FontAwesomeIcon icon={faMessage} />}</Button>
                                <Button onClick={() => { handleInfoButton(id); }}>{<FontAwesomeIcon icon={faInfoCircle} />}</Button>
                            </Col>
                        }
                    </Row>
                </Col>
            </Row>
        </Container>
    );
}