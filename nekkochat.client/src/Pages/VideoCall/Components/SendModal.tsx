import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import SendIcon from '@mui/icons-material/Send';
import { HubConnectionBuilder } from '@microsoft/signalr';


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

export interface IUserData {
   ProfileImage: string,
    username: string,
    id: string
    
}

interface ISendModal {
    Users: IUserData[]
}

export const SendModal: React.FC<ISendModal> = ({ Users }) => {
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const connection = new HubConnectionBuilder()
        .withUrl("https://localhost:7198/videocallhub", { withCredentials: false })
        .withAutomaticReconnect()
        .build();

    connection.start().catch((err) => console.error(err));

    const handleInvokeVideoNotification = (id: string) => {
        connection.invoke('VideoNotification', id).catch((err) => console.error(err));
    }

    return (
        <div>
            <Button onClick={handleOpen}><SendIcon/></Button>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    {Users.map((user) => {
                        return (
                            <Box key={user.id} sx={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "0.2rem" }}>
                                <img style={{ borderRadius: "50%" }} src={user.ProfileImage} />
                                <Typography variant="subtitle2">{user.username}</Typography>
                                <Button onClick={() => handleInvokeVideoNotification(user.id)}><SendIcon /></Button>
                            </Box>
                        )
                    })}
                </Box>
            </Modal>
        </div>
    );
}
