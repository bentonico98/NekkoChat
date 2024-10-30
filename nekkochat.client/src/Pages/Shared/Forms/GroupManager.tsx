import { Modal, Button, Container, Row, Col, Form } from 'react-bootstrap';
import { Search, } from '@chatscope/chat-ui-kit-react';
import GroupButton from '../GroupButton';
import { useAppDispatch, useAppSelector } from '../../../Hooks/storeHooks';
import useGetUserFriendList from '../../../Hooks/Friends/useGetUserFriendList';
import { iGroupRequestTypes, iparticipants, iuserStore, iUserViewModel } from '../../../Constants/Types/CommonTypes';
import { closeModal } from '../../../Store/Slices/userSlice';
import useSearchUserByName from '../../../Hooks/useSearchUserByName';
import { useEffect, useState } from 'react';
import MessageServicesClient from '../../../Utils/MessageServicesClient';

import avatar from "../../../assets/avatar.png";

import { Box, Paper, Typography, MobileStepper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
interface iGroupRequestTypesv2 {
    sender_id?: string,
    group_id?: number,
    groupname?: string,
    grouptype?: string,
    groupdesc?: string,
    groupphoto?: string,
    value?: string,
    participants: iparticipants[]
}

export default function GroupManager() {

    const theme = useTheme();

    const navigate = useNavigate();

    const user: iuserStore | any = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const { friend, value, setValue } = useGetUserFriendList(user.value.id);
    const { searchFriends, searchFromList, resetSearch } = useSearchUserByName(user.value.id);

    const [isValid, setValid] = useState<boolean>(false);

    const [groupInfo, setGroupInfo] = useState<iGroupRequestTypesv2>({
        sender_id: user.value.id,
        participants: [],
        groupname: "",
        groupdesc: "",
        groupphoto: "",
        grouptype: "",
        group_id: 0,
        value: user.value.userName + " has created this group!"
    });

    const steps = [
        {
            label: 'Add Group Information',
            description: `Please, give your group an identity.`,
            elements: [<Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Name</Form.Label>
                    <Form.Control type="text" placeholder="Groupname" value={groupInfo.groupname} onChange={(e) => { setGroupInfo({ ...groupInfo, groupname: e.target.value }); }} />
                </Form.Group>
            </Form>, <Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Type</Form.Label>
                    <Form.Control type="text" placeholder="Category of Group" value={groupInfo.grouptype} onChange={(e) => { setGroupInfo({ ...groupInfo, grouptype: e.target.value }); }} />
                </Form.Group>
            </Form>],
        },
        {
            label: 'Customize your group',
            description:
                'Set up a profile picture.',
            elements: [<Form>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                    <Form.Label>Profile Picture</Form.Label>
                    <Form.Control type="file" value={groupInfo.groupphoto} onChange={(e) => { setGroupInfo({ ...groupInfo, groupphoto: e.target.value }); }} />
                </Form.Group>
            </Form>],
        },
        {
            label: 'Write a welcome message',
            description: `Try writting a custom description for your group.`,
            elements: [<Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={groupInfo.groupdesc} onChange={(e) => { setGroupInfo({ ...groupInfo, groupdesc: e.target.value }); }} />
            </Form.Group>],
        },
    ]

    const [activeStep, setActiveStep] = useState<number>(0);
    const maxSteps = steps.length;

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleGroupCreation = async (info: iGroupRequestTypes) => {
        if (!info.groupphoto) {
            info.groupphoto = `${avatar}`;
        }
        if (!isValid) return 0;

        const res = await MessageServicesClient.createGroup(info);
        if (res.success) {
            navigate("/groupchats/chat/"+res.singleUser);
        }
        return res;
    };

    const addParticipant = (id: string, name: string, isChecked: boolean) => {
        if (isChecked) {
            if (groupInfo.participants?.length > 0) {
                let exists = groupInfo?.participants?.some((el: iparticipants) => el.id === id);
                if (exists) return;
            }
            setGroupInfo({
                ...groupInfo, participants: [...groupInfo?.participants,
                {
                    id,
                    name,
                    connectionid: "0000000000000"
                }]
            });
        } else {
            if (groupInfo!.participants?.length > 0) {
                const newArray = groupInfo?.participants?.filter((el: iparticipants) => el.id !== id);
                setGroupInfo({
                    ...groupInfo, participants: newArray
                });
            }
        }
    };

    const handleCancel = () => {
        dispatch(closeModal());
    }

    useEffect(() => {
        if (
            groupInfo.sender_id &&
            groupInfo.groupname &&
            groupInfo.grouptype &&
            groupInfo.groupdesc &&
            groupInfo.participants.length > 0) {
            setValid(true);
        } else {
            setValid(false);
        }

    }, [groupInfo]);

    return (
        <Modal.Dialog>
            <Modal.Header>
                <Modal.Title>New Group</Modal.Title>
            </Modal.Header>

            <Modal.Body>
                <Container>
                    <Row>
                        <Col xs={8}>
                            <Search
                                placeholder="Search..."
                                onChange={(e) => setValue(e)}
                                onClearClick={() => {
                                    setValue("");
                                    resetSearch();
                                }} />
                        </Col>
                        <Col>
                            <Button
                                variant="primary"
                                onClick={() => { searchFromList(value, friend); }} >Search</Button>
                        </Col>
                    </Row>
                </Container>

                <Container>
                    {searchFriends.length > 0 && <div>
                        <h5>Search Results</h5>
                        {searchFriends.map((el: iUserViewModel, idx: number) =>
                            <GroupButton
                                item={el}
                                idx={idx}
                                key={idx}
                                func={addParticipant} />
                        )}
                    </div>}

                    <h5>My Friends</h5>
                    <hr />
                    {friend.length > 0 && friend.map((el: iUserViewModel, idx: number) => {
                        return <GroupButton
                            item={el}
                            idx={idx}
                            key={idx}
                            func={addParticipant} />
                    })}
                </Container>

                <Box sx={{ maxWidth: 400, flexGrow: 1 }}>
                    <Paper
                        square
                        elevation={0}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            height: 50,
                            pl: 2,
                            bgcolor: 'background.default',
                        }}
                    >
                        <Typography>{steps[activeStep].label}</Typography>
                    </Paper>
                    <Box sx={{ height: 255, maxWidth: 400, width: '100%', p: 2 }}>
                        {steps[activeStep].description}
                        <hr />
                        {steps[activeStep].elements}
                    </Box>
                    <MobileStepper
                        variant="text"
                        steps={maxSteps}
                        position="static"
                        activeStep={activeStep}
                        nextButton={
                            <Button
                                size="sm"
                                onClick={handleNext}
                                disabled={activeStep === maxSteps - 1}
                            >
                                Next
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowLeft />
                                ) : (
                                    <KeyboardArrowRight />
                                )}
                            </Button>
                        }
                        backButton={
                            <Button size="sm" onClick={handleBack} disabled={activeStep === 0}>
                                {theme.direction === 'rtl' ? (
                                    <KeyboardArrowRight />
                                ) : (
                                    <KeyboardArrowLeft />
                                )}
                                Back
                            </Button>
                        }
                    />
                </Box>
            </Modal.Body>

            <Modal.Footer>
                <Button
                    className="mx-1"
                    variant="danger"
                    onClick={handleCancel}>Cancel</Button>
                <Button
                    variant="primary"
                    disabled={!isValid}
                    onClick={() => { handleGroupCreation(groupInfo); }}>Create Group</Button>
            </Modal.Footer>
        </Modal.Dialog>
    );
}