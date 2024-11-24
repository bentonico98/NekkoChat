import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import {
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { iNotificationTypes, iuserStore } from "../../Constants/Types/CommonTypes";
import GetUserNotificationService from "../../Utils/GetUserNotificationService";
import FirstLetterUpperCase from "../../Utils/FirstLetterUpperCase";
import NotificationServiceClient from "../../Utils/NotificationServiceClient";
import { useAppSelector } from "../../Hooks/storeHooks";
import { UserState } from "../../Store/Slices/userSlice";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface iCustomProps {
    item: iNotificationTypes
}
export default function NekkoNotification({ item }: iCustomProps) {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);
    const navigate = useNavigate();

    const [tabColor, setTabColor] = useState<string>("bg-light text-black");
    const [buttonColor, setButtonColor] = useState<string>("text-danger");


    const handleClick = async (id: string | undefined, url: string = "/friends") => {
        if (item.seen) {
           return navigate(url);
        }
        const res = await NotificationServiceClient.ReadNotification({
            user_id: user.value.id,
            id
        });
        if (res.success && url) {
            navigate(url);
        }
    }
    const handleDeleteButton = async (id: string | undefined, url: string | undefined) => {
        const res = await NotificationServiceClient.DeleteNotification({
            user_id: user.value.id,
            id
        });
        if (res.success && url) {
            navigate(url);
        }
    }

    useEffect(() => {
        if (!item.seen) {
            setTabColor("bg-primary text-white");
            setButtonColor("bg-primary text-white");
        } 

    }, [])
    return (
        <>
            {item.type ?
                <Button onClick={() => handleClick(item!.id, item!.url)} >
                    <Card className={tabColor} sx={{ display: 'flex', flexWrap:"wrap", maxHeight: "90px", minWidth: "360px", justifyContent: 'space-between' }}>
                        <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                            <CardContent sx={{ flex: '1 0 auto', textAlign:"left" }}>
                                <Typography component="div" variant="h5">
                                    {FirstLetterUpperCase(GetUserNotificationService(item.type))}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    component="div"
                                    className={tabColor}
                                    sx={{ color: 'text.secondary' }}
                                >
                                    {item.from} {item.operation}
                                </Typography>
                            </CardContent>
                        </Box>
                        <Box sx={{ position: "fixed", right:"0.5rem", display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
                            <Button variant="text" size="large" onClick={() => { handleDeleteButton(item!.id, item!.url) } }  >{<FontAwesomeIcon className={buttonColor} icon={faTrashAlt} />}</Button>
                        </Box>
                    </Card>
                </Button>
                : <Card sx={{ display: 'flex', maxHeight: "90px", justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                sx={{ color: 'text.secondary' }}
                            >
                                No Notifications
                            </Typography>
                        </CardContent>
                    </Box>
                </Card>}
        </>
    );
}