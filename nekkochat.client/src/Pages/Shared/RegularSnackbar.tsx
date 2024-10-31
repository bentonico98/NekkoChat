import * as React from 'react';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';

import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector, useAppDispatch } from '../../Hooks/storeHooks';
import { toggleMsjModal } from '../../Store/Slices/userSlice';
export default function RegularSnackbar() {

    const state = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return event;
        }
        dispatch(toggleMsjModal({ status: false, message: "" }));
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="success"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );
    return (
        <Snackbar
            open={state.message && state.msjModalOpened}
            autoHideDuration={6000}
            onClose={handleClose}
            action={action}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Alert
                onClose={handleClose}
                severity="success"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {state.message}
            </Alert>
        </Snackbar>
    );
}
