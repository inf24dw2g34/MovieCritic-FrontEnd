import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import { useTheme } from '@mui/material';
import DrawerList from './DrawerList';
import UserMenu from './UserMenu';
import HomeIcon from '@mui/icons-material/Home';
import MovieIcon from '@mui/icons-material/Movie';
import RateReviewIcon from '@mui/icons-material/RateReview';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../../context/AuthContext';

export default function Navbar() {
    const { user } = useAuth();
    const theme = useTheme();
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenu = (event) => setAnchorEl(event.currentTarget);
    const handleClose = () => setAnchorEl(null);
    const toggleDrawer = (open) => () => setDrawerOpen(open);

    // Check if user is admin
    const isAdmin = user && user.role === "admin";
    
    // Define base drawer items
    const baseDrawerItems = [
        { text: 'Home', icon: <HomeIcon />, path: '/' },
        { text: 'My Reviews', icon: <RateReviewIcon />, path: '/reviews' },
        { text: 'Movies', icon: <MovieIcon />, path: '/movies' },
        { text: 'Directors', icon: <TheaterComedyIcon />, path: '/directors' },
    ];
    
    // Add Users link only for admins
    const drawerItems = isAdmin 
        ? [...baseDrawerItems, { text: 'Users', icon: <PersonIcon />, path: '/users' }]
        : baseDrawerItems;

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar disableGutters>
                    <Box sx={{ width: '100%', px: 10, display: 'flex', alignItems: 'center' }}>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            MovieCritic
                        </Typography>
                        {user ? (
                            <UserMenu anchorEl={anchorEl} onMenu={handleMenu} onClose={handleClose} user={user} />
                        ) : (
                            <Button
                                color="inherit"
                                onClick={() => { window.location.href = "http://localhost:3000/auth/google"; }}
                            >
                                Login
                            </Button>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <DrawerList items={drawerItems} onItemClick={toggleDrawer(false)} theme={theme} />
            </Drawer>
            <Box
                sx={{
                    width: '100%',
                    height: '4px',
                    background: `linear-gradient(90deg,
            ${theme.palette.secondary.dark} 0%,
            ${theme.palette.secondary.light} 20%, ${theme.palette.secondary.light} 80%,
            ${theme.palette.secondary.dark} 100%)`
                }}
            />
        </Box>
    );
}
