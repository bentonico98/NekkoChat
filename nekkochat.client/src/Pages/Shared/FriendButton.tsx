import { Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faInfoCircle, faAdd, faCheck, faCancel, faVideoCamera } from '@fortawesome/free-solid-svg-icons';
import MessageServicesClient from "../../Utils/MessageServicesClient";
import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";
import avatar from "../../assets/avatar.png";
import { iDisplayMessageTypes, iuserStore, iUserVideoCallTypes, iUserViewModel } from "../../Constants/Types/CommonTypes";
import { openUserProfileModal, setProfileId, UserState } from "../../Store/Slices/userSlice";
import FirstLetterUpperCase from "../../Utils/FirstLetterUpperCase";
import UserAuthServices from "../../Utils/UserAuthServices";
import NotificationServiceClient from "../../Utils/NotificationServiceClient";
import GetNotificationName from "../../Utils/GetNotificationName ";
import { Box,  Typography } from "@mui/material";
import PrivateChatsServerServices from "../../Utils/PrivateChatsServerServices";
import GroupChatsServerServices from "../../Utils/GroupChatsServerServices";

type incomingProps = {
    item?: iUserViewModel
    id: string,
    idx: number,
    DisplayMessage: (obj: iDisplayMessageTypes) => void,
    searchSafe?: boolean
}
export default function FriendButton({ id, idx, item, DisplayMessage, searchSafe = true }: incomingProps) {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const handlePhoneButton = () => {
        const state: iUserVideoCallTypes = {
            id: item!.id,
            name: item!.userName,
            photo: item!.profilePhotoUrl
        }
        navigate("/chats/videocall?externalCall=true", { state });
    }

    const handleManageFriendButton = async (
        operation: string = 'add',
        receiver_id: string,
        sender_id: string) => {

        if (receiver_id == null || sender_id == null) return false;
        if (receiver_id.length <= 0 || sender_id.length <= 0) return false;

        DisplayMessage({ isLoading: true });

        if (operation === "accept") {
            const res = await UserAuthServices.GetManageFriendRequest({ operation, sender_id, receiver_id });

            if (res.success) {
                DisplayMessage({
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
                    }, DisplayMessage);

                    await GroupChatsServerServices.SendNotificationToUser({
                        user_id: receiver_id,
                        operation: " Accepted Your Friend Request.",
                        from: 'Unknown',
                        from_id: sender_id,
                        type: GetNotificationName('request'),
                        url: '/friends'
                    }, DisplayMessage);
                } else {
                    DisplayMessage({
                        hasError: true,
                        isLoading: true,
                        error: notificationSent.error
                    });
                }

            } else {
                if (res.internalMessage) return DisplayMessage({
                    hasError: true,
                    error: res.internalMessage,
                    isLoading: false
                });
                DisplayMessage({
                    hasError: true,
                    error: res.error,
                    isLoading: true
                });
            }
            return res.success;
        } else if (operation === "decline") {
            const res = await UserAuthServices.GetManageFriendRequest({ operation, sender_id, receiver_id });

            if (res.success) {
                DisplayMessage({
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
                    }, DisplayMessage);

                    await GroupChatsServerServices.SendNotificationToUser({
                        user_id: receiver_id,
                        operation: " Declined Your Friend Request.",
                        from: 'Unknown',
                        from_id: sender_id,
                        type: GetNotificationName('request'),
                        url: '/friends'
                    }, DisplayMessage);
                } else {
                    DisplayMessage({
                        hasError: true,
                        isLoading: true,
                        error: notificationSent.error
                    });
                }

            } else {
                if (res.internalMessage) return DisplayMessage({
                    hasError: true,
                    error: res.internalMessage,
                    isLoading: true
                });
                DisplayMessage({
                    hasError: true,
                    error: res.error,
                    isLoading: true
                });
            }
            return res.success;
        } else {
            const res = await UserAuthServices.GetSendFriendRequest({ sender_id, receiver_id });

            if (res.success) {
                DisplayMessage({
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
                    }, DisplayMessage);

                    await GroupChatsServerServices.SendNotificationToUser({
                        user_id: receiver_id,
                        operation: " Sent a Friend Request.",
                        from: 'Unknown',
                        from_id: sender_id,
                        type: GetNotificationName('request'),
                        url: '/friends'
                    }, DisplayMessage);
                } else {
                    DisplayMessage({
                        hasError: true,
                        isLoading: true,
                        error: notificationSent.error
                    });
                }

            } else {
                if (res.internalMessage) return DisplayMessage({
                    hasError: true,
                    isLoading: true,
                    error: res.internalMessage
                });
                DisplayMessage({
                    hasError: true,
                    isLoading: true,
                    error: res.error
                });
            }
            return res.success;
        }
    }

    const handleMessageButton = async (sender_id: string, receiver_id: string, msj: string) => {
        DisplayMessage({ isLoading: true });

        const res = await MessageServicesClient.createChat({
            sender_id,
            receiver_id,
            value: msj
        });

        if (res.success) {
            navigate(`/inbox`, { state: { id: res.singleUser } });
            DisplayMessage({
                hasMsj: true,
                msj: res.message + " Created Group.",
                isLoading: false
            });
        } else {
            if (res.internalMessage) return DisplayMessage({
                hasError: true,
                error: res.internalMessage,
                isLoading: true
            });
            DisplayMessage({
                hasError: true,
                error: res.error,
                isLoading: true
            });
        }
    }

    const handleInfoButton = (id: string) => {
        if (!id) return;
        dispatch(setProfileId(id));
        dispatch(openUserProfileModal());
    }

    return (
        <Box key={idx} className={`Card-Container p-2 border border-1 rounded ${!item!.isFriend && "bg-secondary"}`}>
            <Box className="centeredElement">
                <Image src={item ? item!.profilePhotoUrl : avatar} fluid style={{ height: 'auto', maxWidth: '50px' }} />
            </Box>

            <Box className="centeredElement">
                <Typography variant="h6" >{FirstLetterUpperCase(item!.fname)} {FirstLetterUpperCase(item!.lname)}</Typography>
            </Box>

            <Box className="centeredElement">
                {!item!.isFriend ?
                    <Box className="Card-Container ">
                        {item!.canSendRequest && !item!.alreadyRequest && <Button
                            variant="info"
                            onClick={() => { handleManageFriendButton("add", item!.id, user.value.id); }}>{
                                <FontAwesomeIcon icon={faAdd} />}
                        </Button>}

                        {item!.isSender &&
                            <Button
                                variant="info"
                                onClick={() => { handleManageFriendButton("accept", item!.id, user.value.id); }}>{
                                    <FontAwesomeIcon icon={faCheck} />}
                            </Button>}

                        {item!.alreadyRequest &&
                            <Button
                                variant="danger"
                                onClick={() => { handleManageFriendButton("decline", item!.id, user.value.id); }}>{
                                    <FontAwesomeIcon icon={faCancel} />}
                            </Button>}

                        <Button
                            onClick={() => {
                                handleInfoButton(id);
                            }}>{
                                <FontAwesomeIcon icon={faInfoCircle} />}
                        </Button>
                    </Box> : <Box className="Card-Container" >
                        <Button onClick={() => { handlePhoneButton(); }}>{<FontAwesomeIcon icon={faVideoCamera} />}</Button>
                        <Button onClick={() => { handleMessageButton(user.value.id, id, "Hello"); }}>{<FontAwesomeIcon icon={faMessage} />}</Button>
                        {searchSafe &&
                            <Button onClick={() => { handleInfoButton(id); }}>{<FontAwesomeIcon icon={faInfoCircle} />}</Button>}
                    </Box>
                }
            </Box>
        </Box>
    );
}
