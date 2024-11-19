import { Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import avatar from "../../assets/avatar.png";
import { iparticipants, iuserStore } from "../../Constants/Types/CommonTypes";
import FirstLetterUpperCase from "../../Utils/FirstLetterUpperCase";
import { Box, Stack, Typography } from "@mui/material";
import { UserState } from "../../Store/Slices/userSlice";
import { useAppSelector } from "../../Hooks/storeHooks";

type incomingProps = {
    item?: iparticipants
}
export default function ParticipantButton({ item }: incomingProps) {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);

    const navigate = useNavigate();

    const handleInfoButton = (id: string | undefined) => {
        if (id) {
            navigate(`/account/${id}`);
        }
    }

    return ( 
        <Stack direction="row" sx={{ display: "flex", justifyContent: "space-around", alignItems: "center", width: 300, maxWidth: '100%' }} spacing={3} className={`mx-2 border border-2 rounded p-2 ${user.value.id == item!.id && "bg-warning"}`}>
            <Box>
                <Image src={avatar} roundedCircle fluid width={50} />
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
