import Button from "@mui/material/Button";
import { ReactNode } from "react";


export const VideoCallButton = ({ children, onClick, ...props }: { children: ReactNode, onClick?: React.MouseEventHandler }) => (
    <Button
        sx={{
            margin: "0.3rem",
            backgroundColor: '#777',
            borderRadius: "0.5rem",
            '&:hover': {
                backgroundColor: '#CCC',
                color: 'white',
            },
        }}
        variant="contained"
        onClick={onClick}
        {...props}
    >
        {children}
    </Button>
);