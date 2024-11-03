import { Box, Button, Card, CardContent, Link, Typography } from "@mui/material";
import {
    faTrashAlt
} from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { iNotificationTypes } from "../../Constants/Types/CommonTypes";
import GetUserNotificationService from "../../Utils/GetUserNotificationService";
import FirstLetterUpperCase from "../../Utils/FirstLetterUpperCase";

interface iCustomProps {
    item: iNotificationTypes
}
export default function NekkoNotification({ item }: iCustomProps) {
    return (
        <>
            {item.type ?
                <Link href={item.url} color="textDisabled" className="text-decoration-none">
                <Card sx={{ display: 'flex', maxHeight: "90px", justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'row' }}>
                        <CardContent sx={{ flex: '1 0 auto' }}>
                            <Typography component="div" variant="h5">
                                {FirstLetterUpperCase(GetUserNotificationService(item.type))}
                            </Typography>
                            <Typography
                                variant="subtitle1"
                                component="div"
                                sx={{ color: 'text.secondary' }}
                            >
                                {item.from} {item.operation}
                            </Typography>
                        </CardContent>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start', justifyContent: 'center' }}>
                        <Button variant="text" size="large" >{<FontAwesomeIcon className="text-danger" icon={faTrashAlt} />}</Button>
                    </Box>
                    </Card>
                </Link>
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