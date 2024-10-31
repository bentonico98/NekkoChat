import * as React from 'react';
import Typography, { TypographyProps } from '@mui/material/Typography';
import Skeleton from '@mui/material/Skeleton';
import Grid from '@mui/material/Grid';

export default function RegularSkeleton() {
    return (
        <div>
            <Skeleton variant="rounded" width={210} height={60} />
        </div>
    );
}