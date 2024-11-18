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

    const user: iuserStore | any = useAppSelector((state) => state.user);
    const dispatch = useDispatch();

    const handleClickButton = () => {
        dispatch(logout());
    }

    const changeProfilePicture = async () => {
       
        const form: HTMLFormElement = document.querySelector("#nekkoform")!;

        const formData = new FormData(form);
     
        console.log(formData)

        const res = await UserAuthServices.SetProfilePicture(formData,user.value.id, user.value.userName);
        if (res.success) {
            dispatch(refreshUserData(user.value.id));
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
                            <Col xs={12}>
                                <Image src={user.value.profilePhotoUrl} roundedCircle fluid width={100} className="p-2" />
                                <form onSubmit={(e) => { e.preventDefault(); changeProfilePicture() }} id="nekkoform" encType="multipart/form-data">
                                    <input name="file" type="file" />
                                    <Button type="submit">{<FontAwesomeIcon id="nekkoFileButton" style={{ cursor: "pointer" }}  icon={faPen} />}</Button>
                                </form>
                            </Col>
                            <Col>
                                <Typography variant="h6">First Name: {FirstLetterUpperCase(user.value.fname || "Unknown")}</Typography>
                                <Typography variant="h6">Last Name: {FirstLetterUpperCase(user.value.lname || "Unknown")}</Typography>
                            </Col>
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