import Button from "@mui/material/Button";
import { ReactNode } from "react";


export const VideoCallButton = ({ children, onClick, bgcolor, bgcolorHover, margin, ...props }
    : { children: ReactNode, onClick?: React.MouseEventHandler, bgcolor?: string, bgcolorHover?: string, margin?:string }) => (
    <Button
        sx={{
            margin: margin != null ? margin : "0.3rem",
            backgroundColor: bgcolor != null ? bgcolor : '#005dff',
            borderRadius: "0.5rem",
            '&:hover': {
                backgroundColor: bgcolorHover != null ? bgcolor : '#00b2ff',
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