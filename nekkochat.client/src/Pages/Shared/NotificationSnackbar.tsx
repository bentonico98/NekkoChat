import * as React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector, useAppDispatch } from '../../Hooks/storeHooks';
import { toggleNotification } from '../../Store/Slices/userSlice';
export default function NotificationSnackbar() {

    const state = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return event;
        }

        dispatch(toggleNotification({ status: false, message: "" }));
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="info"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );
    return (
        <Snackbar
            open={state.notificationModal}
            autoHideDuration={6000}
            onClose={handleClose}
            action={action}
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
            <Alert
                onClose={handleClose}
                severity="info"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {state.notification}
            </Alert>
        </Snackbar>
    );
}
