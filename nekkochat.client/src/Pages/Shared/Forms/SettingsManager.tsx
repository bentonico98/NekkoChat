import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import { Modal } from 'react-bootstrap';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

export default function SettingsManager() {
    const [value, setValue] = React.useState(0);

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
        return event;
    };

    return (
        <Container style={{ width: 900, maxWidth: '100%' }}>
            <Modal.Dialog>
                <Modal.Header >
                    <Modal.Title>Settings</Modal.Title>
                </Modal.Header>

                <Modal.Body >
                    <Box
                        sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex' }}
                    >
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={value}
                            onChange={handleChange}
                            aria-label="Vertical tabs example"
                            sx={{ borderRight: 1, borderColor: 'divider', minWidth:"150px" }}
                        >
                            <Tab label="General" {...a11yProps(0)} />
                            <Tab label="Accounts" {...a11yProps(1)} />
                            <Tab label="Friends" {...a11yProps(2)} />
                            <Tab label="Video & Calls" {...a11yProps(3)} />
                            <Tab label="Customization" {...a11yProps(4)} />
                            <Tab label="About" {...a11yProps(5)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            General
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            Accounts
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            Friends
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            Customization
                        </TabPanel>
                        <TabPanel value={value} index={4}>
                            Video & Calls
                        </TabPanel>
                        <TabPanel value={value} index={5}>
                            This application is collaboration between Eng. Benjunior Dorlouis & Eng. Lenny Garcia putting their skills together to build an app, we would be willing to use.
                        </TabPanel>
                    </Box>
                </Modal.Body>
            </Modal.Dialog>
        </Container>

    );
}