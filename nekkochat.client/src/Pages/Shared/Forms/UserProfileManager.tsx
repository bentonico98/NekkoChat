import UserAuthServices from '../../../Utils/UserAuthServices';
import { Container,  Image, Button } from "react-bootstrap";

import avatar from "../../../assets/avatar.png";

import { faMessage, faTrashCan, faAdd, faStopCircle, faVideo, faCheck } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { toggleErrorModal, toggleLoading, toggleMsjModal, toggleNotification, UserState } from '../../../Store/Slices/userSlice';
import { useAppDispatch, useAppSelector } from '../../../Hooks/storeHooks';
import { iuserStore, iUserVideoCallTypes } from '../../../Constants/Types/CommonTypes';
import useDisplayMessage from '../../../Hooks/useDisplayMessage';
import GetNotificationName from '../../../Utils/GetNotificationName ';
import PrivateChatsServerServices from '../../../Utils/PrivateChatsServerServices';
import GroupChatsServerServices from '../../../Utils/GroupChatsServerServices';
import NotificationServiceClient from '../../../Utils/NotificationServiceClient';
import MessageServicesClient from '../../../Utils/MessageServicesClient';
import { Box, Stack, Typography } from '@mui/material';
import FirstLetterUpperCase from '../../../Utils/FirstLetterUpperCase';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function UserProfileManager() {

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

    const user_id = useAppSelector((state) => state.user.profileId);

    const [userInfo, setUserInfo] = useState({
        id: user_id ? user_id : "0",
        userName: "",
        fname: "",
        lname: "",
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

    const handlePhoneButton = () => {
        const state: iUserVideoCallTypes = {
            id: userInfo!.id,
            name: userInfo!.userName,
            photo: userInfo!.profilePhotoUrl
        }
        navigate("/chats/videocall?externalCall=true", { state });
    }

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
        <Container style={{ maxWidth: "max-content" }}>
            <Stack direction="column" style={{ maxWidth: "100%", display: 'flex', alignItems: "center" }}>
                <Image
                    src={userInfo.profilePhotoUrl || avatar}
                    roundedCircle
                    fluid
                    width={150}
                    className="p-2" />
                <Typography variant="h4">{FirstLetterUpperCase(userInfo.fname || "Unknown")} {FirstLetterUpperCase(userInfo.lname || "Unknown")}</Typography>
            </Stack>
            <Stack direction="row" style={{  display:"flex", justifyContent:"center", alignContent: "center" }}>
                {userInfo!.isFriend ?
                    <Box>
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
                                <FontAwesomeIcon icon={faVideo} />}
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
                    </Box>
                    :
                    <Box>
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
                    </Box>}
            </Stack>
            <Stack direction="column" style={{  display:'flex', alignItems:"center" }}>
                <Typography variant="h6">About</Typography>
                <Typography variant="body2">{userInfo.about || "Hi, Let's get to know eachother."}</Typography>
            </Stack>
            <Stack direction="column" style={{  display: 'flex', alignItems: "center" }}>
                <Typography variant="h6">Phone Number</Typography>
                <Typography variant="body2">{userInfo.phoneNumber || "Unspecified"}</Typography>
            </Stack>
            <Stack direction="column" style={{  display: 'flex', alignItems: "center" }}>
                <Typography variant="h6">Friends</Typography>
                <Typography variant="body2">{userInfo.friends_Count || "0"}</Typography>
            </Stack>
        </Container>
    );
}