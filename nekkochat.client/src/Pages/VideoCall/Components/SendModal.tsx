import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SendIcon from '@mui/icons-material/Send';
import useVideocallSignalServer from '../../../Hooks/useVideocallSignalR';
import VideocallServerServices from '../../../Utils/VideoCallService';
import CircularProgress from '@mui/material/CircularProgress';
import { VideoCallButton } from './VideoCallButtom';
import { Stack } from '@mui/material';
import FirstLetterUpperCase from '../../../Utils/FirstLetterUpperCase';
import { Image } from "react-bootstrap";
import avatar from "../../../assets/avatar.png";
import Modal from "react-modal";
import customStyles from '../../../Constants/Styles/ModalStyles';

export type IUserData = {
    id: string,
    profilePhotoUrl: string | null,
    userName: string,
}
export type IProfileData = {
    name: string,
    photo?: string
}

interface ISendModal {
    Users: IUserData[],
    data: IProfileData
    loading?: boolean,
    error?: boolean,
}

export const SendModal: React.FC<ISendModal> = ({ Users, loading, error, data }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const user = JSON.parse(localStorage.getItem("user") || '{}')

    const sender_id = user.id;

    const { connected, conn } = useVideocallSignalServer();

    let connection: any

    React.useEffect(() => {
        if (connected) {
            connection = conn?.connection;
        }
        else {
            return
        }
    }, [connected, connection]);

    const handleInvokeVideoNotification = (receiver_id: string, data: IProfileData) => {
        VideocallServerServices.SendVideoNotification(sender_id, receiver_id, JSON.stringify(data))
    }

    return (
        <div>
            <VideoCallButton margin={'0.3rem'} onClick={handleOpen}><SendIcon /></VideoCallButton>
            <Modal
                style={customStyles}
                isOpen={open}
                onRequestClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box>
                    <Typography sx={{ padding: "1rem" }} variant="h6">Choose the person you want to invite</Typography>
                    {
                        loading ?
                            <Box sx={{ display: 'flex', justifyContent: "center", alignItem: "center" }}>
                                <CircularProgress />
                            </Box >
                            : error ?
                                <Box sx={{ display: 'flex', justifyContent: "center", alignItem: "center" }}>
                                    <Typography variant={"h6"}>No Data</Typography>
                                </Box> :
                                Users.map((user, idx) => {
                                    return (
                                        <Stack key={idx} direction="row" spacing={3} sx={{ maxHeight: "5rem", display: "flex", justifyContent: "space-between", flexWrap: "wrap", alignItems: "center", width: 500, maxWidth: '100%' }} className={`m-2 border border-2 rounded p-2`}>
                                            <Box>
                                                <Image src={user.profilePhotoUrl != null ? user.profilePhotoUrl : avatar} fluid style={{ maxHeight: "50px", maxWidth: '50px' }} />
                                            </Box>

                                            <Box>
                                                <Typography variant="h6" >{FirstLetterUpperCase(user!.userName)}</Typography>
                                            </Box>

                                            <Box>
                                                <Box>
                                                    <Stack direction="row" spacing={1} >
                                                        <Button onClick={() => {
                                                            handleInvokeVideoNotification(user.id, data);
                                                            handleClose();
                                                        }}><SendIcon /></Button>
                                                    </Stack>
                                                </Box>
                                            </Box>
                                        </Stack>
                                    )
                                })}
                </Box>
            </Modal>
        </div>
    );
}
