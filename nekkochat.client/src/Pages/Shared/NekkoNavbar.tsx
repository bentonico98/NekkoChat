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

import nekkoAlt from "../../assets/nekkoAlt.png";
import { Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NekkoNavbar() {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);
    const notifications: string | null = useAppSelector((state) => state.user.notificationCount);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [show, setShow] = React.useState<boolean>(false);

    const handleShow = () => setShow(true);

    const handleLogout = async () => {
        dispatch(toggleLoading(true));
        dispatch(logout());
        await UserAuthServices.Logout({ user_id: user.value.id });
        window.location.href = "/login";
    }

    const handleNavigate = (url: string) => {
        if (url) {
            navigate(url);
        }
    }

    return (
        <Navbar bg="light" sticky="top" data-bs-theme="light">
            <Container>
                <Navbar.Brand onClick={() => handleNavigate("/inbox")} style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    textAlign: "center"
                }} >
                    <img
                        alt=""
                        src={nekkoAlt}
                        width="50"
                        height="50"
                        className="d-inline-block align-top"
                    />{' '}
                    <Typography variant="h4">NekkoChat</Typography>
                </Navbar.Brand>
                <Nav>
                    <Nav.Link onClick={() => handleNavigate("/inbox")}>{<FontAwesomeIcon icon={faInbox} />} Inbox</Nav.Link>
                    <Nav.Link onClick={() => handleNavigate("/groupchats")}>{<FontAwesomeIcon icon={faPeopleGroup} />} Groupchats</Nav.Link>
                    <Nav.Link onClick={() => handleNavigate("/chats/videocall")}>{<FontAwesomeIcon icon={faVideoCamera} />} Videocalls</Nav.Link>
                    <Nav.Link onClick={() => handleNavigate("/friends")}>{<FontAwesomeIcon icon={faUserFriends} />} Friends</Nav.Link>
                </Nav>
                <Nav>
                    <Nav.Link onClick={() => handleNavigate("/chats?type=favorites")}>{<FontAwesomeIcon icon={faStar} />} Favorite</Nav.Link>
                    <Nav.Link onClick={() => handleNavigate("/chats?type=archived")}>{<FontAwesomeIcon icon={faArchive} />} Archived</Nav.Link>
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
