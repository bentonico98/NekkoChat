import avatar from "../../assets/avatar.png";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd, faBars } from '@fortawesome/free-solid-svg-icons';

import { Stack, Image, Button} from "react-bootstrap";
import { openModal } from "../../Store/Slices/userSlice";
import { useAppDispatch } from "../../Hooks/storeHooks";
import { useNavigate } from "react-router-dom";

export default function ProfileHeader() {

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
            <Image src={avatar} roundedCircle fluid width={50} className="p-2" />
            <div className="ms-auto">
                <Button type="submit" variant="light" className="m-2" onClick={handleAddButton}  >{<FontAwesomeIcon icon={faAdd} />}</Button>
                <Button type="submit" variant="light" className="m-2" onClick={handleSettingsButton} >{<FontAwesomeIcon icon={faBars} />}</Button>
            </div>
        </Stack>
    );
}