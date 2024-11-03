import avatar from "../../assets/avatar.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faBars } from '@fortawesome/free-solid-svg-icons';

import { Stack, Image, Button} from "react-bootstrap";
import { openModal, UserState } from "../../Store/Slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";
import { useNavigate } from "react-router-dom";
import { iuserStore } from "../../Constants/Types/CommonTypes";
import { Typography } from "@mui/material";

export default function ProfileHeader() {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleAddButton = () => {
        dispatch(openModal());
    }
    const handleSettingsButton = () => {
        navigate("/settings");
    }
    return (
        <Stack direction="horizontal" gap={3} >
            <Image src={user.value.profilePhotoUrl || avatar} roundedCircle fluid width={50} className="p-2" />
            <Typography>{user.value.fname } {user.value.lname}</Typography>
            <div className="ms-auto">
                <Button type="submit" variant="light" className="m-2" onClick={handleAddButton}  >{<FontAwesomeIcon icon={faAdd} />}</Button>
                <Button type="submit" variant="light" className="m-2" onClick={handleSettingsButton} >{<FontAwesomeIcon icon={faBars} />}</Button>
            </div>
        </Stack>
    );
}