import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import SendIcon from '@mui/icons-material/Send';
import Grid from '@mui/material/Grid2';
import useVideocallSignalServer from '../../../Hooks/useVideocallSignalR';
import VideocallServerServices from '../../../Utils/VideoCallService';
import CircularProgress from '@mui/material/CircularProgress';
import { VideoCallButton } from './VideoCallButtom';
//import useGetUser from '../../../Hooks/useGetUser';
//import { useAppSelector } from '../../../Hooks/storeHooks';


const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};

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
        VideocallServerServices.SendVideoNotification( sender_id, receiver_id, JSON.stringify(data))
    }

    return (
        <div>
            <VideoCallButton onClick={handleOpen}><SendIcon /></VideoCallButton>
            <Modal
                sx={{ width: "auto" }}
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography sx={{ padding: "1rem" }} variant="h6">Seleccione a la persona que desea invitar</Typography>
                    {
                        loading ?
                            <Box sx={{ display: 'flex', justifyContent:"center", alignItem:"center" }}>
                            <CircularProgress />
                        </Box >
                            : error ?
                        <Box sx={{ display: 'flex', justifyContent: "center", alignItem: "center" }}>
                             <Typography variant={"h6" }>Could not get data</Typography>
                        </Box> :
                        Users.map((user) => {
                        return (
                            <Grid key={user.id}  container>
                                <Grid size={8} sx={{ padding: "0 4rem", display: "flex", alignItems: "start", justifyContent: "start" }}>
                                    <img style={{ borderRadius: "50%", width: "3rem", height: "3rem" }} src={user.profilePhotoUrl != null ? user.profilePhotoUrl : "../../../../public/defaultAvatar.jpg"} />
                                    <Typography sx={{ padding: "1rem" }} variant="subtitle2">{user.userName}</Typography>
                              </Grid>
                                <Grid size={4}>
                                    <Button onClick={() => {
                                        handleInvokeVideoNotification(user.id, data);
                                        console.log("sendModal " + sender_id + " " + user.id);
                                        console.log("connection ", conn?.connectionId)
                                    }}><SendIcon /></Button>
                              </Grid>
                            </Grid>
                        )
                    })}
                </Box>
            </Modal>
        </div>
    );
}
