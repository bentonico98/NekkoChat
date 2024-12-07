import { Link, useNavigate } from "react-router-dom"
import { Button, Navbar, Nav, Container } from 'react-bootstrap';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faArrowRightLong, faCopyright } from '@fortawesome/free-solid-svg-icons';
import nekkoAlt from "../../assets/nekkoAlt.png";
import { Divider, Stack, Typography } from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
export default function Index() {
    const navigate = useNavigate();
    return (
        <Container className="fluidContainer" style={{paddingBottom:'2em'} }>
            <Navbar className="nekkoNavbar"  sticky="top" data-bs-theme="light">
                <Container>
                    <Navbar.Brand href="/" style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        textAlign: "center"
                    }} >
                        <img
                            src={nekkoAlt}
                            width="50"
                            height="50"
                            className="d-inline-block align-top"
                        />{' '}
                        <Typography variant="h4" id="invisible">NekkoChat</Typography>
                    </Navbar.Brand>

                    <Nav>
                        <Button variant="primary" >Download {<FontAwesomeIcon icon={faDownload} />}</Button>
                    </Nav>
                </Container>
            </Navbar>
            <Box
                className="my-5"
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minWidth: "80vw",
                    minHeight: "40vh"
                }}
            >
                <Paper elevation={3} className='border border-1 rounded-5' sx={{ minWidth: "100%", minHeight: "100%" }}>
                    <Box className="Two-Row-Container">
                        <Box className="p-3 Two-Row-Container-Second-Item">
                            <Stack direction="column" spacing={1} className="text-left p-3" sx={{ alignItems: "flex-start" }}>
                                <Typography variant="h3" >WELCOME TO NEKKOCHAT</Typography>
                                <Typography variant="h6" >The Place Where Cat's Lovers Meet Fellow Cat's Lovers</Typography>
                                <Typography variant="body1">1. Individual Chats</Typography>
                                <Typography variant="body1" >2. Create Packs(Groups) To Chat with others</Typography>
                                <Typography variant="body1">3. VideoChats</Typography>
                                <Typography variant="body1">4. VoiceCalls</Typography>
                                <Typography variant="body1">...and more</Typography>
                            </Stack>

                            <Divider />

                            <Stack direction='column' spacing={2} className="text-left p-3" sx={{ alignItems: "flex-start" }}>
                                <Link to="/login" className="text-muted">Login To Your Account</Link>
                                <Link to="/register" className="text-muted">Create An Account</Link>
                            </Stack>

                        </Box>
                        <Box className="p-3 Two-Row-Container-Second-Item">
                            <Stack direction='column' spacing={2} className="text-left p-3" sx={{ alignItems: "center", justifyContent: 'center' }}>
                                <img
                                    id="MainLogoImage"
                                    src={nekkoAlt}
                                    className="d-inline-block align-top"
                                />

                                <Button variant="primary" onClick={() => { navigate('/inbox') }} >Visit NekkoChat {<FontAwesomeIcon icon={faArrowRightLong} />}</Button>
                            </Stack>
                        </Box>
                    </Box>
                </Paper>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Link to="/inbox" className="text-muted">{<FontAwesomeIcon icon={faCopyright} />} Derechos Reservados Por Benjunior Dorlouis & Lenny Garcia </Link>
            </Box>
        </Container>
    );
}


