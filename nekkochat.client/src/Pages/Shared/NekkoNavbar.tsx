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
import { Box, Typography } from '@mui/material';
import { createSearchParams, useNavigate } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';

import "../../../src/index.css";
function NekkoNavbar() {

    const user: UserState | iuserStore | any = useAppSelector((state) => state.user);
    const notifications: string | null = useAppSelector((state) => state.user.notificationCount);

    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const [show, setShow] = React.useState<boolean>(false);
    const [openMenu, setOpenMenu] = React.useState<boolean>(false);

    const handleShow = () => setShow(true);

    const handleLogout = async () => {
        dispatch(toggleLoading(true));
        dispatch(logout());
        await UserAuthServices.Logout({ user_id: user.value.id });
        window.location.href = "/login";
    }

    const toggleHamburgerMenu = () => {
        setOpenMenu(!openMenu);
    }

    const handleNavigate = (url: string, search: string | null = null) => {
        if (url) {
            if (search) {
                navigate({
                    pathname: url,
                    search: createSearchParams({
                        type: search
                    }).toString()
                });
            } else {
                navigate(url);
            }
        }
    }

    return (
        <>
            <Navbar className="nekkoNavbar" bg="light" sticky="top" data-bs-theme="light">
                <Container>
                    <Navbar.Brand onClick={() => handleNavigate("/inbox", null)} style={{
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
                        <Typography id="invisible" variant="h4" className="">NekkoChat</Typography>
                    </Navbar.Brand>

                    <Nav id="invisible1">
                        <Nav.Link onClick={() => handleNavigate("/inbox", null)}>{<FontAwesomeIcon icon={faInbox} />} Inbox</Nav.Link>
                        <Nav.Link onClick={() => handleNavigate("/groupchats", null)}>{<FontAwesomeIcon icon={faPeopleGroup} />} Groupchats</Nav.Link>
                        <Nav.Link onClick={() => handleNavigate("/chats/videocall", null)}>{<FontAwesomeIcon icon={faVideoCamera} />} Videocalls</Nav.Link>
                        <Nav.Link onClick={() => handleNavigate("/friends", null)}>{<FontAwesomeIcon icon={faUserFriends} />} Friends</Nav.Link>
                    </Nav>
                    <Nav id="invisible2">
                        <Nav.Link onClick={() => handleNavigate("/chats", 'favorites')}>{<FontAwesomeIcon icon={faStar} />} Favorite</Nav.Link>
                        <Nav.Link onClick={() => handleNavigate("/chats", 'archived')}>{<FontAwesomeIcon icon={faArchive} />} Archived</Nav.Link>
                    </Nav>
                    <Nav id="invisible3">
                        <Button variant="primary" onClick={handleShow} >{<FontAwesomeIcon icon={faMailBulk} />} <span>{notifications}</span></Button>
                        <Button className="mx-2" variant="danger" onClick={handleLogout} >{<FontAwesomeIcon icon={faSignOutAlt} />}</Button>
                    </Nav>
                    <Box className="hamburgerMenuButton">
                        <Button variant="secondary" onClick={toggleHamburgerMenu} >{<MenuIcon />}</Button>
                    </Box>
                </Container>

                <NotificationBar show={show} setShow={setShow} userId={user.value.id} />
            </Navbar>
            {openMenu && <Box className="hamburgerMenu">
                <Nav.Link onClick={() => handleNavigate("/inbox", null)}>{<FontAwesomeIcon icon={faInbox} />} Inbox</Nav.Link>
                <Nav.Link onClick={() => handleNavigate("/groupchats", null)}>{<FontAwesomeIcon icon={faPeopleGroup} />} Groupchats</Nav.Link>
                <Nav.Link onClick={() => handleNavigate("/chats/videocall", null)}>{<FontAwesomeIcon icon={faVideoCamera} />} Videocalls</Nav.Link>
                <Nav.Link onClick={() => handleNavigate("/friends", null)}>{<FontAwesomeIcon icon={faUserFriends} />} Friends</Nav.Link>
                <Nav.Link onClick={() => handleNavigate("/chats", 'favorites')}>{<FontAwesomeIcon icon={faStar} />} Favorite</Nav.Link>
                <Nav.Link onClick={() => handleNavigate("/chats", 'archived')}>{<FontAwesomeIcon icon={faArchive} />} Archived</Nav.Link>
                <Button variant="danger" onClick={handleLogout} >{<FontAwesomeIcon icon={faSignOutAlt} />}</Button>
            </Box>}
        </>

    );
}

export default NekkoNavbar;
