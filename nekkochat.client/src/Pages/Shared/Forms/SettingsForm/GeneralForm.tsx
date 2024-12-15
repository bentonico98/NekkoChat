import { Box } from '@mui/material';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useAppDispatch, useAppSelector } from '../../../../Hooks/storeHooks';
import { IUserEditTypes, iuserStore } from '../../../../Constants/Types/CommonTypes';
import { closeSettingModal, refreshUserData, toggleErrorModal, toggleMsjModal } from '../../../../Store/Slices/userSlice';
import { useState } from 'react';
import UserAuthServices from '../../../../Utils/UserAuthServices';

function GeneralForm() {

    const user: iuserStore = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const [userInfo, setUserInfo] = useState<IUserEditTypes>({
        user_id: user.value?.id || '0',
        fname: user.value?.fname || 'Unknown',
        lname: user.value?.lname || 'Unknown',
        about: user.value?.about || ''
    });

    const handleSaveButton = async () => {
        const res = await UserAuthServices.ManageUserProfile(userInfo);
        if (res.success) {
            dispatch(refreshUserData(user.value?.id || '0'));
            dispatch(toggleMsjModal({ status: true, message: "Succesfull" }));
        } else {
            dispatch(toggleErrorModal({ status: true, message: res.error }));
        }
    }
    const handleCancelButton = async () => {
        dispatch(closeSettingModal());
    }

    return (
        <Box sx={{ width: "100%" }}>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">First Name</InputGroup.Text>
                <Form.Control
                    placeholder={user.value.fname || "First Name"}
                    aria-label="First Name"
                    aria-describedby="basic-addon1"
                    value={userInfo.fname}
                    onChange={(e) => setUserInfo({ ...userInfo, fname: `${e.target.value}` })}
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Last Name</InputGroup.Text>
                <Form.Control
                    placeholder={user.value.lname || "Last Name"}
                    aria-label="Last Name"
                    aria-describedby="basic-addon1"
                    value={userInfo.lname}
                    onChange={(e) => setUserInfo({ ...userInfo, lname: `${e.target.value}` })}
                />
            </InputGroup>

            <Form.Label htmlFor="about">About</Form.Label>
            <InputGroup>
                <Form.Control
                    placeholder={user.value.about || "Write Something about yourself..."}
                    value={userInfo.about}
                    onChange={(e) => { setUserInfo({ ...userInfo, about: `${e.target.value}` }); }}
                    as="textarea"
                    aria-label="Write Something about yourself..." />
            </InputGroup>

            <InputGroup>
                <Button variant="primary" onClick={handleSaveButton}>Save</Button>
                <Button variant="danger" onClick={handleCancelButton}>Cancel</Button>
            </InputGroup>
        </Box>
    );
}

export default GeneralForm;