import { Paper } from '@mui/material';
import Skeleton from '@mui/material/Skeleton';

export default function RegularSkeleton() {
    return (
        <Paper variant="outlined">
            <Skeleton variant="rounded" width={210} height={60} />
        </Paper>
    );
}