import Offcanvas from 'react-bootstrap/Offcanvas';
import NekkoNotification from './NekkoNotification';
import useGetNotifications from '../../Hooks/Notifications/useGetNotifications';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setNotificationCount, toggleNotification } from '../../Store/Slices/userSlice';
import { useAppSelector } from '../../Hooks/storeHooks';

interface iCustomProps {
    show: boolean,
    setShow: (show: boolean) => void,
    userId: string
}
export default function NotificationBar({ show, setShow, userId }: iCustomProps) {

    const notificationCount = useAppSelector((state) => state.user.notificationCount);
    const dispatch = useDispatch();

    const handleClose = () => setShow(false);

    const { notifications } = useGetNotifications(userId);

    useEffect(() => {
        if (notifications.length > 0) {
            var counts = notifications.filter((el) => el.seen == false).length;

            if (counts > parseInt(notificationCount)) {
                dispatch(toggleNotification({ status: true, message: counts + " New Notification"}));
            }
           
            dispatch(setNotificationCount(counts.toString()));
        }
    }, [notifications]);

    return (
        <Offcanvas show={show} onHide={handleClose}  name="end" placement="end">
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>All Notifications</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                {notifications.map((el, idx) => {
                    return <NekkoNotification item={el} key={idx} />
                })}
            </Offcanvas.Body>
        </Offcanvas>
    );
}
