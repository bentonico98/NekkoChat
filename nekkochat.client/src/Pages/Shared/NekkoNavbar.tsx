import { Button, Navbar, Nav, Container } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faStar, faArchive, faSignOutAlt, faUserFriends, faVideoCamera, faPeopleGroup, faInbox } from '@fortawesome/free-solid-svg-icons';

import { useAppDispatch, useAppSelector } from '../../Hooks/storeHooks';

import { logout } from "../../Store/Slices/userSlice";

import { useNavigate } from 'react-router-dom';
import UserAuthServices from '../../Utils/UserAuthServices';
import { iuserStore } from '../../Constants/Types/CommonTypes';

function NekkoNavbar() {

    const user:iuserStore = useAppSelector((state) => state.user);
    const dispatch = useAppDispatch();

    const handleLogout = async () => {
        await UserAuthServices.Logout(user.value.id);
        const navigate = useNavigate();
        dispatch(logout());
        navigate("/login");
    }
    return (
        <Navbar bg="light" sticky="top"  data-bs-theme="light">
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
                    <Button variant="danger" onClick={handleLogout} >{<FontAwesomeIcon icon={faSignOutAlt} />}</Button>
                </Nav>
            </Container>
        </Navbar>
    );
}

export default NekkoNavbar;