import { Container, Image, Button } from "react-bootstrap";

import avatar from "../../assets/avatar.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faMessage, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserAuthServices from "../../Utils/UserAuthServices";
import FirstLetterUpperCase from "../../Utils/FirstLetterUpperCase";
import MessageServicesClient from "../../Utils/MessageServicesClient";
import { toggleErrorModal, toggleLoading, toggleMsjModal, toggleNotification, UserState } from "../../Store/Slices/userSlice";
import { iparticipants, iuserStore } from "../../Constants/Types/CommonTypes";
import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";
import useDisplayMessage from "../../Hooks/useDisplayMessage";
import NotificationServiceClient from "../../Utils/NotificationServiceClient";
import GetNotificationName from "../../Utils/GetNotificationName ";
import { Box, Stack, Typography } from "@mui/material";
import PrivateChatsServerServices from "../../Utils/PrivateChatsServerServices";
import GroupChatsServerServices from "../../Utils/GroupChatsServerServices";
import ParticipantButton from "../Shared/ParticipantButton";

export default function GroupProfile() {

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
        id: "0",
        name: "",
        type: "",
        description: "",
        friends_Count: 0,
        profilePhotoUrl: "avatar",
        participants: []
    });

    useEffect(() => {
        setDisplayInfo({ isLoading: true });

        MessageServicesClient.getGroupById(parseInt(user_id)).then((res) => {
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

        if (!receiver_id || !sender_id) return false;
        if (receiver_id.length <= 0 || sender_id.length <= 0) return false;

        setDisplayInfo({ isLoading: true });

        if (operation === "accept") {
            const res = await UserAuthServices.GetManageFriendRequest(
                {
                    operation,
                    sender_id,
                    receiver_id
                });

            if (res.success) {
                setDisplayInfo({
                    hasMsj: true,
                    msj: res.message + " Accepted Request.",
                    isLoading: false
                });
                const notificationSent = await NotificationServiceClient.CreateNotification({
                    user_id: receiver_id,
                    operation: " Accepted Your Friend Request.",
                    from: 'Unknown',
                    from_id: sender_id,
                    type: GetNotificationName('request'),
                    url: '/friends'
                });

                if (notificationSent.success) {
                    await PrivateChatsServerServices.SendNotificationToUser({
                        user_id: receiver_id,
                        operation: " Accepted Your Friend Request.",
                        from: 'Unknown',
                        from_id: sender_id,
                        type: GetNotificationName('request'),
                        url: '/friends'
                    }, setDisplayInfo);

                    await GroupChatsServerServices.SendNotificationToUser({
                        user_id: receiver_id,
                        operation: " Accepted Your Friend Request.",
                        from: 'Unknown',
                        from_id: sender_id,
                        type: GetNotificationName('request'),
                        url: '/friends'
                    }, setDisplayInfo);
                } else {
                    setDisplayInfo({
                        hasError: true,
                        isLoading: true,
                        error: notificationSent.error
                    });
                }
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
                const notificationSent = await NotificationServiceClient.CreateNotification({
                    user_id: receiver_id,
                    operation: " Declined Your Friend Request.",
                    from: 'Unknown',
                    from_id: sender_id,
                    type: GetNotificationName('request'),
                    url: '/friends'
                });

                if (notificationSent.success) {
                    await PrivateChatsServerServices.SendNotificationToUser({
                        user_id: receiver_id,
                        operation: " Declined Your Friend Request.",
                        from: 'Unknown',
                        from_id: sender_id,
                        type: GetNotificationName('request'),
                        url: '/friends'
                    }, setDisplayInfo);

                    await GroupChatsServerServices.SendNotificationToUser({
                        user_id: receiver_id,
                        operation: " Declined Your Friend Request.",
                        from: 'Unknown',
                        from_id: sender_id,
                        type: GetNotificationName('request'),
                        url: '/friends'
                    }, setDisplayInfo);
                } else {
                    setDisplayInfo({
                        hasError: true,
                        isLoading: true,
                        error: notificationSent.error
                    });
                }
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
        } else if (operation === "remove") {

            const res = await UserAuthServices.GetManageFriendRequest({
                operation,
                sender_id,
                receiver_id
            });

            if (res.success) {
                setDisplayInfo({
                    hasMsj: true,
                    msj: res.message + " Removal Request.",
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
                const notificationSent = await NotificationServiceClient.CreateNotification({
                    user_id: receiver_id,
                    operation: " Sent a Friend Request.",
                    from: 'Unknown',
                    from_id: sender_id,
                    type: GetNotificationName('request'),
                    url: '/friends'
                });

                if (notificationSent.success) {
                    await PrivateChatsServerServices.SendNotificationToUser({
                        user_id: receiver_id,
                        operation: " Sent a Friend Request.",
                        from: 'Unknown',
                        from_id: sender_id,
                        type: GetNotificationName('request'),
                        url: '/friends'
                    }, setDisplayInfo);

                    await GroupChatsServerServices.SendNotificationToUser({
                        user_id: receiver_id,
                        operation: " Sent a Friend Request.",
                        from: 'Unknown',
                        from_id: sender_id,
                        type: GetNotificationName('request'),
                        url: '/friends'
                    }, setDisplayInfo);
                } else {
                    setDisplayInfo({
                        hasError: true,
                        isLoading: true,
                        error: notificationSent.error
                    });
                }
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
        <>
            <Container className="text-center fluidContainer" >
                <Image
                    src={userInfo.profilePhotoUrl || avatar}
                    fluid
                    width={150}
                />
                <Typography variant="h4" className="my-3">{FirstLetterUpperCase(userInfo.name || "Unknown")}</Typography>
                <Box className="Three-Row-Container">
                    <Button
                        onClick={() => {
                            handlePhoneButton();
                        }}>{<FontAwesomeIcon icon={faPhone} />}
                    </Button>
                    <Button
                        onClick={() => {
                            handleMessageButton(user.value.id, userInfo.id, "Hello");
                        }}>{<FontAwesomeIcon icon={faMessage} />}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={() => {
                            handleManageFriendButton("remove", userInfo.id, user.value.id);
                        }}>{<FontAwesomeIcon icon={faTrashCan} />}
                    </Button>
                </Box>

                <Stack direction="column" className="my-2" spacing={3}>
                    <Box>
                        <Typography variant="h6">Description</Typography>
                        <Typography variant="body2" className="text-muted">{userInfo.description || "Hi, Let's get to know eachother."}</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h6">Participants</Typography>
                        <Box className="Three-Row-Container">
                            {userInfo.participants.length > 0 && userInfo.participants.map((el: iparticipants, idx: number) => {
                                return (
                                    <ParticipantButton key={idx} item={el} />
                                );
                            })}
                        </Box>
                    </Box>
                </Stack>
            </Container>
        </>
    );
}