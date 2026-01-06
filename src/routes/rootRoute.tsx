import * as React from 'react';
import {useQuery} from '@tanstack/react-query';
import {Outlet, createRootRouteWithContext} from '@tanstack/react-router';
import type {QueryClient} from '@tanstack/react-query';
import {Box, CssBaseline, Menu, MenuItem, Divider, styled} from '@mui/material';
import {useTranslation} from 'react-i18next';
import {auth, useAuthStore} from '../features/auth/store/authStore';
import {API_URL} from '../shared/api/http';
import {Header} from '../shared/layout/Header';
import {Sidebar} from '../shared/layout/Sidebar';
import {LogoutDialog} from '../shared/layout/LogoutDialog';

const drawerWidth = 240;

export type RouterContext = {
    queryClient: QueryClient;
    auth: typeof auth;
};

export const rootRoute = createRootRouteWithContext<RouterContext>()({
    beforeLoad: async () => {
        if (!auth.getUser()) { //* firstly even before showing interface checks if there are any info about user in local storage
            await auth.fetchCurrentUser(); //*if not -> get("Auth/me")
        }
    },
    component: RootLayout,
});

//shouldForwardProp -> When you convert my component into actual HTML, check all the props. If you see a prop named “open”, use it for colouring (CSS), 
// but delete it and do not write it in the final HTML tag.
const Main = styled('main', {shouldForwardProp: (prop) => prop !== 'open'})<{ //*main idea to move content when drawer opens
    open?: boolean;
}>(({theme}) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`, //move to the left when drawer closes
    variants: [
        {
            props: ({open}) => open,
            style: {
                transition: theme.transitions.create('margin', {
                    easing: theme.transitions.easing.easeOut,
                    duration: theme.transitions.duration.enteringScreen, //animation
                }),
                marginLeft: 0,
            },
        },
    ],
}));

const DrawerHeader = styled('div')(({theme}) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
}));

function RootLayout() { //*main component 
    const {t} = useTranslation();
    const [open, setOpen] = React.useState(false);
    const user = useAuthStore((s) => s.user);

    // Periodic session check (ping)
    useQuery({
        queryKey: ['session-check'],
        queryFn: () => auth.fetchCurrentUser(),
        enabled: !!user,
        refetchInterval: 60000, // 1 minute
        staleTime: 60000,
        gcTime: 120000,
    });

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

    const handleDrawerOpen = () => setOpen(true);
    const handleDrawerClose = () => setOpen(false);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => setAnchorEl(null);

    const handleLogoutClick = () => {
        handleMenuClose();
        setLogoutDialogOpen(true);
    };

    const handleLogoutConfirm = () => {
        setLogoutDialogOpen(false);
        auth.signOut();
        window.location.href = `${API_URL}/auth/logout`;
    };

    return (
        <Box sx={{display: 'flex'}}>
            <CssBaseline/>
            <Header
                open={open}
                onOpenDrawer={handleDrawerOpen}
                user={user}
                onProfileMenuOpen={handleProfileMenuOpen}
            />
            <Sidebar open={open} onClose={handleDrawerClose}/>
            <Main open={open}>
                <DrawerHeader/>
                <Outlet/>
            </Main>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                transformOrigin={{horizontal: 'right', vertical: 'top'}}
                anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
            >
                <MenuItem disabled sx={{opacity: '1 !important', color: 'text.secondary'}}>
                    {user?.email}
                </MenuItem>
                <Divider/>
                <MenuItem onClick={handleLogoutClick} sx={{color: 'error.main'}}>
                    {t('common.logout')}
                </MenuItem>
            </Menu>

            <LogoutDialog
                open={logoutDialogOpen}
                onClose={() => setLogoutDialogOpen(false)}
                onConfirm={handleLogoutConfirm}
            />
        </Box>
    );
}