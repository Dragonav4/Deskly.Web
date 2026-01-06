import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, styled, useTheme } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import EventNoteIcon from '@mui/icons-material/EventNote';
import PeopleIcon from '@mui/icons-material/People';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { desksModule } from '../../features/desks';
import { reservationModule } from '../../features/reservations';
import { userModule } from '../../features/users';
import { useAuthStore } from '../../features/auth/store/authStore';

const drawerWidth = 240;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

export function Sidebar({ open, onClose }: Readonly<SidebarProps>) {
    const theme = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const userRole = useAuthStore(s => s.user?.role);
    const isAdmin = userRole === 'Admin';

    return (
        <Drawer
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                },
            }}
            variant="persistent"
            anchor="left"
            open={open}
        >
            <DrawerHeader>
                <IconButton onClick={onClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </DrawerHeader>
            <Divider />
            <List>
                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate({ to: desksModule.routes.list.fullPath })}>
                        <ListItemIcon>
                            <DesktopWindowsOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('desk.listTitle')} />
                    </ListItemButton>
                </ListItem>

                <ListItem disablePadding>
                    <ListItemButton onClick={() => navigate({ to: reservationModule.routes.list.fullPath })}>
                        <ListItemIcon>
                            <EventNoteIcon />
                        </ListItemIcon>
                        <ListItemText primary={t('reservation.listTitle')} />
                    </ListItemButton>
                </ListItem>

                {isAdmin && (
                    <ListItem disablePadding>
                        <ListItemButton onClick={() => navigate({ to: userModule.routes.list.fullPath })}>
                            <ListItemIcon>
                                <PeopleIcon />
                            </ListItemIcon>
                            <ListItemText primary={t('user.listTitle')} />
                        </ListItemButton>
                    </ListItem>
                )}
            </List>
        </Drawer>
    );
}
