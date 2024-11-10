import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import { useAppSelector } from '../../../Hooks/storeHooks';
import { iuserStore } from '../../../Constants/Types/CommonTypes';
import { Typography } from '@mui/material';
import FirstLetterUpperCase from '../../../Utils/FirstLetterUpperCase';
import { Image } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { logout } from '../../../Store/Slices/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPen } from '@fortawesome/free-solid-svg-icons';
import { useRef } from 'react';

export default function ProfileManager() {

    const user: iuserStore | any = useAppSelector((state) => state.user);
    const dispatch = useDispatch();

    const filePickerRef = useRef<any>();

    const handlPickerButton = () => {
        filePickerRef.current.click();
    }

    const handleClickButton = () => {
        dispatch(logout());
    }
    
    return (
        <Container style={{ width: 400, maxWidth: '100%' }}>
            <Modal.Dialog>
                <Modal.Header >
                    <Modal.Title>Profile</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Container>
                        <Row>
                            <Col xs={12}>
                                <Image src={user.value.profilePhotoUrl} roundedCircle fluid width={100} className="p-2" />
                                <input ref={filePickerRef} type="file" style={{ display: "none" }} id="nekkoFilePicker" />

                                <FontAwesomeIcon id="nekkoFileButton" style={{ cursor: "pointer" }} onClick={handlPickerButton} icon={faPen} />
                            </Col>
                            <Col>
                                <Typography variant="h6">First Name: {FirstLetterUpperCase(user.value.fname || "Unknown")}</Typography>
                                <Typography variant="h6">Last Name: {FirstLetterUpperCase(user.value.lname || "Unknown")}</Typography>
                            </Col>
                        </Row>
                        <Row>

                        </Row>
                        <Row>
                            <Typography variant="h6">About</Typography>
                            <Typography variant="body2">{user.value.about || "Hi, Let's get to know eachother."}</Typography>
                        </Row>
                        <Row>
                            <Typography variant="h6">Phone Number</Typography>
                            <Typography variant="body2">{user.value.phoneNumber || "Unspecified"}</Typography>
                        </Row>
                        <Row>
                            <Typography variant="h6">Friends</Typography>
                            <Typography variant="body2">{user.value.friends_Count || "0"}</Typography>
                        </Row>

                        <Button variant="danger" onClick={() => { handleClickButton() }}>Logout</Button>
                    </Container>
                </Modal.Body>

            </Modal.Dialog>
        </Container>
    );
}