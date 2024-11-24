import { Button, Image } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import avatar from "../../assets/avatar.png";
import { iparticipants, iuserStore } from "../../Constants/Types/CommonTypes";
import FirstLetterUpperCase from "../../Utils/FirstLetterUpperCase";
import { Box, Stack, Typography } from "@mui/material";
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
        <Stack direction="row" sx={{ marginY:"1rem", display: "flex", justifyContent: "space-between", alignItems: "center", width: 300, maxWidth: '100%' }} spacing={3} className={`mx-2 border border-2 rounded p-2 ${user.value.id == item!.id && "bg-warning"}`}>
            <Box>
                <Image src={avatar}  fluid style={{ maxHeight: "50px", maxWidth: '50px' }} />
            </Box>
            <Box>
                <Typography variant="h6" >{FirstLetterUpperCase(item!.name)}</Typography>
            </Box>
            {user.value.id != item!.id &&
                <Box>
                    <Button onClick={() => { handleInfoButton(item!.id); }}>{<FontAwesomeIcon icon={faInfoCircle} />}</Button>
                </Box>
            }
        </Stack>
    );
}
