import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';
import { useAppSelector } from '../../../Hooks/storeHooks';

export default function NekkoSpinner() {

    const isLoading = useAppSelector((state) => state.user.isLoading);
    return (
        <Stack spacing={2} direction="row" sx={{
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            zIndex: 999,
            transform: 'translate(-50%, -50%)',
            position: "absolute"
        }} >
            {isLoading &&
                <CircularProgress color="success" />
            }
        </Stack>
    );
}
