import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import MenuIcon from '@mui/icons-material/Menu';
import { useAppDispatch } from '../../Hooks/storeHooks';
import { openGroupModal, openModal, openProfileModal, openSettingModal } from '../../Store/Slices/userSlice';

export default function NekkoChatSpeedDialer() {

    const dispatch = useAppDispatch();

    const openSettings = () => {
        dispatch(openSettingModal());
    }

    const openPrivate = () => {
        dispatch(openModal());
    }

    const openGroup = () => {
        dispatch(openGroupModal());
    }

    const openProfile = () => {
        dispatch(openProfileModal());
    }

    const actions = [
        { icon: <AccountBoxIcon />, name: 'My Profile', action: openProfile },
        { icon: <SettingsIcon />, name: 'Settings', action: openSettings },
        { icon: <GroupAddIcon />, name: 'Create Group', action: openGroup },
        { icon: <SpeedDialIcon />, name: 'Start Chat', action: openPrivate },
    ];

    return (
        <SpeedDial
            ariaLabel="SpeedDial openIcon example"
            sx={{ position: 'fixed', bottom: 16, left: 16 }}
            icon={<MenuIcon/>}
        >
            {actions.map((action) => (
                <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    tooltipTitle={action.name}
                    onClick={() => { action.action() } }
                />
            ))}
        </SpeedDial>
    );
}