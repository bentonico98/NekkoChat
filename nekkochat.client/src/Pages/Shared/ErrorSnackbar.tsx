import * as React from 'react';
import Alert from '@mui/material/Alert';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { useAppSelector, useAppDispatch } from '../../Hooks/storeHooks';
import { toggleErrorModal } from '../../Store/Slices/userSlice';
export default function ErrorSnackbar() {

    const state = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return event;
        }

        dispatch(toggleErrorModal({ status: false, message: "" }));
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );
    return (
        <Snackbar
            open={state.error && state.errorModalOpened}
            autoHideDuration={6000}
            onClose={handleClose}
            action={action}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        >
            <Alert
                onClose={handleClose}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {state.error}
            </Alert>
        </Snackbar>
    );
}
