import { Button, Image } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import avatar from "../../assets/avatar.png";
import { iparticipants, iuserStore } from "../../Constants/Types/CommonTypes";
import FirstLetterUpperCase from "../../Utils/FirstLetterUpperCase";
import { Box, Typography } from "@mui/material";
import { openUserProfileModal, setProfileId, UserState } from "../../Store/Slices/userSlice";
import { useAppDispatch, useAppSelector } from "../../Hooks/storeHooks";

type incomingProps = {
    item?: iparticipants
}
export default function ParticipantButton({ item }: incomingProps) {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);

    const dispatch = useAppDispatch();

    const handleInfoButton = (id: string | undefined) => {
        if (!id) return;
        dispatch(setProfileId(id));
        dispatch(openUserProfileModal());
    }

    return (
        <Box className={`mx-1 border border-2 rounded p-1 Three-Row-Container ${user.value.id == item!.id && "bg-warning"}`}>
            <Box className="centeredElement">
                <Image  src={avatar} fluid style={{ maxHeight: "50px", maxWidth: '50px' }} />
            </Box>
            <Box className="centeredElement">
                <Typography  variant="h6" >{FirstLetterUpperCase(item!.name)}</Typography>
            </Box>
            {user.value.id != item!.id &&
                <Box className="centeredElement">
                    <Button onClick={() => { handleInfoButton(item!.id); }}>{<FontAwesomeIcon icon={faInfoCircle} />}</Button>
                </Box>
            }
        </Box>
    );
}
