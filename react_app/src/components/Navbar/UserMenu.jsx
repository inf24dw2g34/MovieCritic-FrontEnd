import { IconButton, Menu, MenuItem, Avatar } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useNavigate } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';

export default function UserMenu({ anchorEl, onMenu, onClose, user }) {
	const navigate = useNavigate();
    const { logout } = useAuth();
    
    const handleLogout = async () => {
        await logout();
        navigate('/');
        onClose();
    };
    
    const handleProfileClick = () => {
        navigate(`/users/${user.id}`);
        onClose();
    };

	const handleSettingsClick = () => {
        navigate(`/users/settings`);
        onClose();
    };
	
	return (
		<>
			<IconButton
				size="large"
				aria-label="account of current user"
				aria-controls="menu-appbar"
				aria-haspopup="true"
				onClick={onMenu}
				color="inherit"
			>
				{user && user.name ? (
					<Avatar alt={user.name} src={user.profile_picture + '?sz=128'} />
				) : (
					<AccountCircle />
				)}
			</IconButton>
			<Menu
				id="menu-appbar"
				anchorEl={anchorEl}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				keepMounted
				transformOrigin={{ vertical: 'top', horizontal: 'right' }}
				open={Boolean(anchorEl)}
				onClose={onClose}
			>
				<MenuItem onClick={handleProfileClick}>Profile</MenuItem>
				<MenuItem onClick={handleSettingsClick}>Settings</MenuItem>
				<MenuItem onClick={handleLogout}>Logout</MenuItem>
			</Menu>
		</>
	);
}