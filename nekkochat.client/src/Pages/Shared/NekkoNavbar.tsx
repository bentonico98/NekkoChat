import { Button, Navbar, Nav, Container } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faStar,
    faArchive,
    faSignOutAlt,
    faUserFriends,
    faVideoCamera,
    faPeopleGroup,
    faInbox,
    faMailBulk
} from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from '../../Hooks/storeHooks';

import { logout, toggleLoading, UserState } from "../../Store/Slices/userSlice";

import UserAuthServices from '../../Utils/UserAuthServices';
import { iuserStore } from '../../Constants/Types/CommonTypes';

import * as React from "react";
import NotificationBar from './NotificationBar';
function NekkoNavbar() {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);
    const notifications: string | null = useAppSelector((state) => state.user.notificationCount);

    const dispatch = useAppDispatch();

    const [show, setShow] = React.useState<boolean>(false);

    const navigate = () => {
        window.location.href = "/login"
    }

    const handleShow = () => setShow(true);

    const handleLogout = async () => {
        dispatch(toggleLoading(true));
        await UserAuthServices.Logout({ user_id: user.value.id });
        dispatch(logout());
        navigate();
    }

    React.useLayoutEffect(() => {
        if (!UserAuthServices.isAuthenticated()) {
            dispatch(toggleLoading(true));
            navigate();
        }
    }, []);

    return (
        <Navbar bg="light" sticky="top" data-bs-theme="light">
            <Container>
                <Navbar.Brand href="/inbox">NekkoChat</Navbar.Brand>
                <Nav>
                    <Nav.Link href="/inbox">{<FontAwesomeIcon icon={faInbox} />} Inbox</Nav.Link>
                    <Nav.Link href="/groupchats">{<FontAwesomeIcon icon={faPeopleGroup} />} Groupchats</Nav.Link>
                    <Nav.Link href="/chats/video">{<FontAwesomeIcon icon={faVideoCamera} />} VideoCalls</Nav.Link>
                    <Nav.Link href="/friends">{<FontAwesomeIcon icon={faUserFriends} />} Friends</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link href="/chats?type=favorites">{<FontAwesomeIcon icon={faStar} />} Favorite</Nav.Link>
                    <Nav.Link href="/chats?type=archived">{<FontAwesomeIcon icon={faArchive} />} Archived</Nav.Link>
                </Nav>
                <Nav>
                    <Button variant="primary" onClick={handleShow} >{<FontAwesomeIcon icon={faMailBulk} />} <span>{notifications}</span></Button>
                    <Button className="mx-2" variant="danger" onClick={handleLogout} >{<FontAwesomeIcon icon={faSignOutAlt} />}</Button>
                </Nav>
            </Container>
            <NotificationBar show={show} setShow={setShow} userId={user.value.id} />
        </Navbar>
    );
}

export default NekkoNavbar;
