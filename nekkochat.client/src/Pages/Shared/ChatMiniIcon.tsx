import { Button, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMessage, faPhone } from '@fortawesome/free-solid-svg-icons';
import MessageServicesClient from "../../Utils/MessageServicesClient";
import { useAppSelector } from "../../Hooks/storeHooks";
import avatar from "../../assets/avatar.png";
import { iuserStore } from "../../Constants/Types/CommonTypes";
import { UserState } from "../../Store/Slices/userSlice";
import FirstLetterUpperCase from "../../Utils/FirstLetterUpperCase";
import { Box, Stack, Typography } from "@mui/material";


interface iSimpleUser {
    fname: string,
    lname: string,
    id: string
}

type incomingProps = {
    item?: iSimpleUser
    idx: number,
}
export default function ChatMiniIcon({ idx, item }: incomingProps) {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);

    const navigate = useNavigate();

    const handlePhoneButton = () => { }

    const handleMessageButton = async (sender_id: string, receiver_id: string, msj: string) => {
        const res = await MessageServicesClient.createChat({
            sender_id,
            receiver_id,
            value: msj
        });

        if (res.success) {
            navigate(`/inbox`, { state: { id: res.singleUser } });
        }
    }

    return (
        <Stack key={idx} direction="row" className={`mx-2 border border-2 rounded pt-3`}>
            <Box sx={{ width: 100, maxWidth: '100%' }} className="mx-2">
                <Image src={avatar} roundedCircle fluid width={50} />
            </Box>

            <Box sx={{ width: 100, maxWidth: '100%' }}>
                <Typography variant="h6" >{FirstLetterUpperCase(item!.fname)} {FirstLetterUpperCase(item!.lname)}</Typography>
            </Box>

            <Box sx={{ width: 100, maxWidth: '100%' }}>
                <Stack direction="row" spacing={1} >
                    <Button onClick={() => { handlePhoneButton(); }}>{<FontAwesomeIcon icon={faPhone} />}</Button>
                    <Button onClick={() => { handleMessageButton(user.value.id, item!.id, "Hello"); }}>{<FontAwesomeIcon icon={faMessage} />}</Button>
                </Stack>
            </Box>
        </Stack>
    );
}
