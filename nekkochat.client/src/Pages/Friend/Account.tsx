import { Container, Row, Image, Button, Col } from "react-bootstrap";

import avatar from "../../assets/avatar.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMessage, faTrashCan, faAdd, faStopCircle, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserAuthServices from "../../Utils/UserAuthServices";
import FirstLetterUpperCase from "../../Utils/FirstLetterUpperCase";
import MessageServicesClient from "../../Utils/MessageServicesClient";
import { toggleErrorModal, toggleLoading, toggleMsjModal, toggleNotification, UserState } from "../../Store/Slices/userSlice";
import { iuserStore } from "../../Constants/Types/CommonTypes";
import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";
import useDisplayMessage from "../../Hooks/useDisplayMessage";

export default function Account() {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);
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

    const navigate = useNavigate();

    const { user_id } = useParams() as { user_id: string };

    const [userInfo, setUserInfo] = useState({
        id: user_id ? user_id : "0",
        userName: "",
        about: "Hi, Let's get to know eachother.",
        phoneNumber: "Unspecified",
        friends_Count: 0,
        profilePhotoUrl: "avatar",
        isFriend: false,
        isSender: false,
    });

    useEffect(() => {
        setDisplayInfo({ isLoading: true });

        UserAuthServices.SearchUserById(user_id, user.value.id).then((res) => {
            if (res.success) {
                setUserInfo(res.singleUser);
                setDisplayInfo({ isLoading: false });
            } else {
                if (res.internalMessage) return setDisplayInfo({
                    hasError: true,
                    error: res.internalMessage,
                    isLoading: true
                });
                setDisplayInfo({
                    hasError: true,
                    error: res.error,
                    isLoading: true

                });
            }
        });
    }, [user_id]);

    const handlePhoneButton = () => { }

    const handleManageFriendButton = async (
        operation: string = 'add',
        receiver_id: string,
        sender_id: string) => {

        if (receiver_id == null || sender_id == null) return false;
        if (receiver_id.length <= 0 || sender_id.length <= 0) return false;

        setDisplayInfo({ isLoading: true });

        if (operation === "accept") {
            const res = await UserAuthServices.GetManageFriendRequest(
                {
                    operation,
                    sender_id,
                    receiver_id
                });

            if(res.success){
                setDisplayInfo({
                    hasMsj: true,
                    msj: res.message + " Accepted Request.",
                    isLoading: false
                });
            } else {
                if (res.internalMessage) return setDisplayInfo({
                    hasError: true,
                    error: res.internalMessage,
                    isLoading: true
                });
                setDisplayInfo({
                    hasError: true,
                    error: res.error,
                    isLoading: true
                });
            }

            return res.success;
        } else if (operation === "decline") {

            const res = await UserAuthServices.GetManageFriendRequest({
                operation,
                sender_id,
                receiver_id
            });

            if (res.success) {
                setDisplayInfo({
                    hasMsj: true,
                    msj: res.message + " Decline Request.",
                    isLoading: false
                });
            } else {
                if (res.internalMessage) return setDisplayInfo({
                    hasError: true,
                    error: res.internalMessage,
                    isLoading: true
                });
                setDisplayInfo({
                    hasError: true,
                    error: res.error,
                    isLoading: true
                });
            }
            return res.success;
        } else {

            const res = await UserAuthServices.GetSendFriendRequest({
                sender_id,
                receiver_id
            });

            if (res.success) {
                setDisplayInfo({
                    hasMsj: true,
                    msj: res.message + " Friend Request.",
                    isLoading: false
                });
            } else {
                if (res.internalMessage) return setDisplayInfo({
                    hasError: true,
                    error: res.internalMessage,
                    isLoading: true
                });
                setDisplayInfo({
                    hasError: true,
                    error: res.error,
                    isLoading: true
                });
            }

            return res.success;
        }
    }

    const handleMessageButton = async (sender_id: string, receiver_id: string, msj: string) => {
        setDisplayInfo({ isLoading: true });

        const res = await MessageServicesClient.createChat({
            sender_id,
            receiver_id,
            value: msj
        });
        if (res.success) {
            navigate(`/inbox`, { state: { id: res.singleUser } });
            setDisplayInfo({
                hasMsj: true,
                msj: res.message + " Created Group.",
                isLoading: false
            });
        } else {
            if (res.internalMessage) return setDisplayInfo({
                hasError: true,
                error: res.internalMessage,
                isLoading: true
            });
            setDisplayInfo({
                hasError: true,
                error: res.error,
                isLoading: true

            });
        }
    }
    return (
        <Container>
            <Row>
                <Col xs={12}>
                    <Image
                        src={userInfo.profilePhotoUrl || avatar}
                        roundedCircle
                        fluid
                        width={250}
                        className="p-2" />
                </Col>
                <Col>
                    <h2>{FirstLetterUpperCase(userInfo.userName || "Unknown")}</h2>
                </Col>
            </Row>
            <Row>
                <Col>
                    {userInfo!.isFriend ?
                        <Col>
                            {userInfo.isSender &&
                                <Button
                                    variant="info"
                                    onClick={() => {
                                        handleManageFriendButton("accept", userInfo.id, user.value.id);
                                    }}>{
                                        <FontAwesomeIcon icon={faCheck} />}
                                </Button>}
                            <Button
                                onClick={() => {
                                    handlePhoneButton();
                                }}
                                className="mx-1">{
                                    <FontAwesomeIcon icon={faPhone} />}
                            </Button>
                            <Button
                                className="mx-1"
                                onClick={() => {
                                    handleMessageButton(user.value.id, userInfo.id, "Hello");
                                }}>{<FontAwesomeIcon icon={faMessage} />}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => {
                                    handleManageFriendButton("remove", userInfo.id, user.value.id);
                                }}
                                className="mx-1">{
                                    <FontAwesomeIcon icon={faTrashCan} />}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => {
                                    handleManageFriendButton("block", userInfo.id, user.value.id);
                                }}
                                className="mx-1">{
                                    <FontAwesomeIcon icon={faStopCircle} />}
                            </Button>
                        </Col>
                        :
                        <Col>
                            <Button
                                variant="danger"
                                className="mx-1"
                                onClick={() => {
                                    handleManageFriendButton("add", userInfo!.id, user.value.id);
                                }}>{
                                    <FontAwesomeIcon icon={faAdd} />}
                            </Button>
                            <Button
                                variant="danger"
                                onClick={() => {
                                    handleManageFriendButton("block", userInfo.id, user.value.id);
                                }}
                                className="mx-1">{
                                    <FontAwesomeIcon icon={faStopCircle} />}
                            </Button>
                        </Col>}
                </Col>
            </Row>
            <Row>
                <h5>About</h5>
                <p>{userInfo.about || "Hi, Let's get to know eachother."}</p>
            </Row>
            <Row>
                <h5>Phone Number</h5>
                <p>{userInfo.phoneNumber || "Unspecified"}</p>
            </Row>
            <Row>
                <h5>Friends</h5>
                <p>{userInfo.friends_Count || "0"}</p>
            </Row>
        </Container>
    );
}