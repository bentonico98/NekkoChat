import { useEffect, useState } from "react";
import { iNotificationTypes } from "../../Constants/Types/CommonTypes";
import NotificationServiceClient from "../../Utils/NotificationServiceClient";

export default function useGetNotifications(user_id: string) {
    const [notifications, setNotifications] = useState<iNotificationTypes[]>([]);

    const getUserNotifications = async () => {
        const res = await NotificationServiceClient.GetAllNotification(user_id);
        if (res.success) {
            setNotifications(res.user);
        }
    }
    useEffect(() => {
        if (user_id) {
            getUserNotifications();
        }
    }, [user_id]);

    return { notifications };
}