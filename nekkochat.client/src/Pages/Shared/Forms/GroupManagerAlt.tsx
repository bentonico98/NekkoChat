import { Modal, Button, Container } from 'react-bootstrap';
import { Search, } from '@chatscope/chat-ui-kit-react';
import GroupButton from '../GroupButton';
import { useAppDispatch, useAppSelector } from '../../../Hooks/storeHooks';
import { iGroupRequestTypes, iparticipants, iuserStore, iUserViewModel } from '../../../Constants/Types/CommonTypes';
import { toggleErrorModal, toggleLoading, toggleMsjModal, toggleNotification } from '../../../Store/Slices/userSlice';
import { useEffect, useState } from 'react';
import MessageServicesClient from '../../../Utils/MessageServicesClient';

import avatar from "../../../assets/avatar.png";

import { Box, Typography, Stack, Divider } from '@mui/material';
import useGetUserFriendList from '../../../Hooks/Friends/useGetUserFriendList';
import useSearchUserByName from '../../../Hooks/useSearchUserByName';
import useDisplayMessage from '../../../Hooks/useDisplayMessage';
import RegularSkeleton from '../Skeletons/RegularSkeleton';
import NotificationServiceClient from '../../../Utils/NotificationServiceClient';
import GetNotificationName from '../../../Utils/GetNotificationName ';
import GroupChatsServerServices from '../../../Utils/GroupChatsServerServices';
interface iGroupRequestTypesv2 {
    sender_id?: string,
    user_id?: string,
    group_id?: number,
    groupname?: string,
    grouptype?: string,
    groupdesc?: string,
    groupphoto?: string,
    value?: string,
    participants: iparticipants[],
    members?: iparticipants[]
}

export default function GroupManagerAlt({
    groupname,
    group_id = 0,
    grouptype,
    groupdesc,
    groupphoto,
    participants = [] }: iGroupRequestTypesv2) {

    const user: iuserStore | any = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const [allMembers, setAllMembers] = useState<iUserViewModel[]>([]);

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

    const { friend, value, setValue } = useGetUserFriendList(user.value.id, setDisplayInfo);
    const { searchFriends, searchFromList, resetSearch } = useSearchUserByName(user.value.id, setDisplayInfo);

    const [isValid, setValid] = useState<boolean>(false);

    const [groupInfo, setGroupInfo] = useState<iGroupRequestTypesv2>({
        sender_id: user.value.id,
        user_id: user.value.id,
        participants: [],
        members: participants,
        groupname,
        groupdesc,
        groupphoto,
        grouptype,
        group_id,
        value: user.value.userName + "Null!"
    });

    const handleGroupCreation = async (info: iGroupRequestTypes) => {
        if (!info.groupphoto) {
            info.groupphoto = `${avatar}`;
        }
        if (!isValid) return 0;
        setDisplayInfo({ isLoading: true });

        info.participants!.forEach(async (el: iparticipants) => {
            info.user_id = el.id;
            const res = await MessageServicesClient.addParticipantToGroup(info);

            if (!res.success) {
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
                return;
            }

            let notificationSent = await NotificationServiceClient.CreateNotification({
                user_id: el.id,
                operation: "Added To A Groupchat.",
                from: 'Unknown',
                from_id: user.value.id,
                type: GetNotificationName('group'),
                url: '/groupchats'
            });

            if (notificationSent.success) {
                await GroupChatsServerServices.SendNotificationToUser({
                    user_id: el.id,
                    operation: "Added To A Groupchat.",
                    from: 'Unknown',
                    from_id: user.value.id,
                    type: GetNotificationName('group'),
                    url: '/groupchats'
                }, setDisplayInfo);
            } else {
                setDisplayInfo({
                    hasError: true,
                    isLoading: true,
                    error: notificationSent.error
                });
            }
        });
    };

    const addParticipant = (id: string, name: string, isChecked: boolean) => {
        setDisplayInfo({ isLoading: true });

        if (isChecked) {
            if (groupInfo.participants && groupInfo.participants?.length > 0) {
                let exists = groupInfo?.participants?.some((el: iparticipants) => el.id === id);
                if (exists) return;
            }
            setGroupInfo({
                ...groupInfo, participants: [...groupInfo.participants,
                {
                    id,
                    name,
                    connectionid: "0000000000000",
                    profilePic: '/src/assets/avatar.png'
                }]
            });
            setDisplayInfo({ isLoading: false });
        } else {
            if (groupInfo.participants && groupInfo!.participants?.length > 0) {
                const newArray = groupInfo?.participants?.filter((el: iparticipants) => el.id !== id);
                setGroupInfo({
                    ...groupInfo, participants: newArray
                });
                setDisplayInfo({ isLoading: false });
            }
        }
    };

    useEffect(() => {
        if (groupInfo.participants && groupInfo.participants.length > 0 && groupInfo.group_id && groupInfo.group_id > 0) {
            setValid(true);
        } else {
            setValid(false);
        }

    }, [groupInfo]);

    useEffect(() => {
        var payload: iUserViewModel[] = [];
        friend.forEach((f) => {
            if (groupInfo.members && groupInfo.members.length > 0) {
                const included = groupInfo.members.some((p) => p.id == f.id);
                if (!included) {
                    payload.push(f)
                }
            }
        });
        setAllMembers(payload);

    }, [friend]);

    return (
        <Container style={{ width: 600, maxWidth: '100%' }}>
            <Modal.Dialog >
                <Modal.Header>
                    <Modal.Title>Add New Member</Modal.Title>
                </Modal.Header>

                <Stack direction="row" spacing={2}>
                    <Box sx={{ width: "100%", maxWidth: '100%' }}>
                        <Search
                            placeholder="Search..."
                            onChange={(e) => setValue(e)}
                            onClearClick={() => {
                                setValue("");
                                resetSearch();
                            }} />
                    </Box>

                    <Box>
                        <Button
                            variant="primary"
                            onClick={() => { searchFromList(value, friend); }} >Search</Button>
                    </Box>
                </Stack>

                <Modal.Body>
                    {searchFriends.length > 0 && <Box>
                        <Typography variant="h5" className="my-1">Search Results</Typography>
                        {searchFriends.map((el: iUserViewModel, idx: number) =>
                            <GroupButton
                                item={el}
                                idx={idx}
                                key={idx}
                                func={addParticipant} />
                        )}
                    </Box>}

                    <Box sx={{ maxWidth: 600, flexGrow: 1, overflowY: "auto" }}>
                        <Typography variant="h5" className="my-2">My Friends</Typography>
                        <Divider />
                        {allMembers.length > 0 ? allMembers.map((el: iUserViewModel, idx: number) => {
                            return <GroupButton
                                item={el}
                                idx={idx}
                                key={idx}
                                func={addParticipant} />
                        }) : <RegularSkeleton />}
                    </Box>
                </Modal.Body>

                <Modal.Footer>
                    <Button
                        variant="primary"
                        disabled={!isValid}
                        onClick={() => { handleGroupCreation(groupInfo); }}>Add Member</Button>
                </Modal.Footer>
            </Modal.Dialog>
        </Container>
    );
}