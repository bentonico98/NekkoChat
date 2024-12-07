import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Skeleton from '@mui/material/Skeleton';

export default function ConversationSkeleton() {

    return (
        <div>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ margin: 1 }}>
                    <Skeleton variant="circular">
                        <Avatar />
                    </Skeleton>
                </Box>
                <Box sx={{ width: '100%' }}>
                    <Skeleton variant="rectangular" width="100%">
                        <div style={{ paddingTop: '57%' }} />
                    </Skeleton>
                </Box>
            </Box>
        </div>
    );
}