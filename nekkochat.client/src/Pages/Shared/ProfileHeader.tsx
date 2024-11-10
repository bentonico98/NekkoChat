import avatar from "../../assets/avatar.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faBars, faPerson } from '@fortawesome/free-solid-svg-icons';

import { Stack, Image, Button } from "react-bootstrap";
import { openModal, openProfileModal, UserState, openSettingModal } from "../../Store/Slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";
import { iuserStore } from "../../Constants/Types/CommonTypes";
import { Typography } from "@mui/material";

export default function ProfileHeader() {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const handleAddButton = () => {
        dispatch(openModal());
    }
    const handleProfileButton = () => {
        dispatch(openProfileModal());
    }
    const handleSettingsButton = () => {
        dispatch(openSettingModal());
    }
    return (
        <Stack direction="horizontal" gap={3} className="p-2" >
            <Image src={user.value.profilePhotoUrl || avatar} roundedCircle fluid width={50} className="p-2" />
            <Typography>{user.value.fname} {user.value.lname}</Typography>
            <Stack direction="horizontal" gap={2} >
                <Button type="submit" variant="light" onClick={handleProfileButton} >{<FontAwesomeIcon icon={faPerson} />}</Button>
                <Button type="submit" variant="light" onClick={handleAddButton}  >{<FontAwesomeIcon icon={faAdd} />}</Button>
                <Button type="submit" variant="light" onClick={handleSettingsButton} >{<FontAwesomeIcon icon={faBars} />}</Button>
            </Stack>
        </Stack>
    );
}