import { Box } from '@mui/material';
import { Button } from 'react-bootstrap';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import { useAppSelector } from '../../../../Hooks/storeHooks';
import { iuserStore } from '../../../../Constants/Types/CommonTypes';
import { UserState } from '../../../../Store/Slices/userSlice';

function GeneralForm() {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);

    return (
        <Box sx={{ width: "100%" }}>
            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">First Name</InputGroup.Text>
                <Form.Control
                    placeholder={user.value.fname || "First Name"}
                    aria-label="First Name"
                    aria-describedby="basic-addon1"
                />
            </InputGroup>

            <InputGroup className="mb-3">
                <InputGroup.Text id="basic-addon1">Last Name</InputGroup.Text>
                <Form.Control
                    placeholder={user.value.lname || "Last Name"}
                    aria-label="Last Name"
                    aria-describedby="basic-addon1"
                />
            </InputGroup>

            <Form.Label htmlFor="about">About</Form.Label>
            <InputGroup>
                <Form.Control placeholder={user.value.about || "Write Something about yourself..."} as="textarea" aria-label="Write Something about yourself..." />
            </InputGroup>

            <InputGroup>
                <Button variant="primary">Save</Button>
                <Button variant="danger">Cancel</Button>
            </InputGroup>
        </Box>
    );
}

export default GeneralForm;