import { Modal, Container, Row, Col, Button } from 'react-bootstrap';
import { useAppSelector } from '../../../Hooks/storeHooks';
import { iuserStore } from '../../../Constants/Types/CommonTypes';
import { Typography } from '@mui/material';
import FirstLetterUpperCase from '../../../Utils/FirstLetterUpperCase';
import { Image } from "react-bootstrap";
import { useDispatch } from 'react-redux';
import { logout, refreshUserData, toggleErrorModal, toggleMsjModal } from '../../../Store/Slices/userSlice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faPen } from '@fortawesome/free-solid-svg-icons';
import UserAuthServices from '../../../Utils/UserAuthServices';

export default function ProfileManager() {

    const user: iuserStore = useAppSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleClickButton = () => {
        dispatch(logout());
    }

    const changeProfilePicture = async () => {

        const form: HTMLFormElement = document.querySelector("#nekkoform")!;

        const formData = new FormData(form);

        console.log(formData)

        const res = await UserAuthServices.SetProfilePicture(formData, user.value?.id || '0', user.value?.userName || 'Unknown');
        if (res.success) {
            dispatch(refreshUserData(user.value?.id || '0'));
            dispatch(toggleMsjModal({ status: true, message: "Profile Picture Updated." }));
        } else {
            dispatch(toggleErrorModal({ status: true, message: res.error }));
        }
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
                            <Col xs={12} style={{ display: 'flex', flexDirection: 'column', alignItems: "center" }}>
                                <Image src={user.value.profilePhotoUrl} roundedCircle fluid width={200} />
                                <form onSubmit={(e) => { e.preventDefault(); changeProfilePicture() }} id="nekkoform" encType="multipart/form-data">
                                    <input name="file" type="file" />
                                    <Button type="submit">{<FontAwesomeIcon id="nekkoFileButton" style={{ cursor: "pointer" }} icon={faPen} />}</Button>
                                </form>
                            </Col>
                            <Col>
                                <Typography variant="h6">First Name: <Typography variant="subtitle1" className="text-muted">{FirstLetterUpperCase(user.value.fname || "Unknown")}</Typography></Typography>
                                <Typography variant="h6">Last Name: <Typography variant="subtitle1" className="text-muted">{FirstLetterUpperCase(user.value.lname || "Unknown")}</Typography></Typography>
                            </Col>
                        </Row>

                        <Row>
                            <Typography variant="h6" className="text-bold">About</Typography>
                            <Typography variant="body2" className="text-muted">{user.value.about || "Hi, Let's get to know eachother."}</Typography>
                        </Row>
                        <Row>
                            <Typography variant="h6" className="text-bold">Phone Number</Typography>
                            <Typography variant="body2" className="text-muted">{user.value?.phoneNumber || "Unspecified"}</Typography>
                        </Row>
                        <Row>
                            <Typography variant="h6" className="text-bold">Friends</Typography>
                            <Typography variant="body2" className="text-muted">{user.value.friends_Count || "0"}</Typography>
                        </Row>

                        <Button variant="danger" onClick={() => { handleClickButton() }}>Logout</Button>
                    </Container>
                </Modal.Body>

            </Modal.Dialog>
        </Container>
    );
}