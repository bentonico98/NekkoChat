import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import { Container } from '@mui/material';
import { Modal } from 'react-bootstrap';
import AboutForm from './SettingsForm/AboutForm';
import GeneralForm from './SettingsForm/GeneralForm';
import CustomizationForm from './SettingsForm/CustomizationForm';
import VideoCallForm from './SettingsForm/VideoCallForm';

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
                <Container>
                    {children}
                </Container>
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
        <Container style={{ width: '90vw', maxWidth: '100%' }}>
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
                            sx={{ borderRight: 1, borderColor: 'divider', minWidth: "150px" }}
                        >
                            <Tab label="General" {...a11yProps(0)} />
                            <Tab label="Video & Calls" {...a11yProps(1)} />
                            <Tab label="Customization" {...a11yProps(2)} />
                            <Tab label="About" {...a11yProps(3)} />
                        </Tabs>
                        <TabPanel value={value} index={0}>
                            <GeneralForm />
                        </TabPanel>
                        <TabPanel value={value} index={1}>
                            <VideoCallForm />
                        </TabPanel>
                        <TabPanel value={value} index={2}>
                            <CustomizationForm />
                        </TabPanel>
                        <TabPanel value={value} index={3}>
                            <AboutForm />
                        </TabPanel>
                    </Box>
                </Modal.Body>
            </Modal.Dialog>
        </Container>

    );
}