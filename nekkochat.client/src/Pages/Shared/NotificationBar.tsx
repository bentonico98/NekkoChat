import Offcanvas from 'react-bootstrap/Offcanvas';
import NekkoNotification from './NekkoNotification';
import useGetNotifications from '../../Hooks/Notifications/useGetNotifications';

interface iCustomProps {
    show: boolean,
    setShow: (show: boolean) => void,
    userId: string
}
export default function NotificationBar({ show, setShow, userId }: iCustomProps) {

    const handleClose = () => setShow(false);

    const { notifications } = useGetNotifications(userId);

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
