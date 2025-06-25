import { Box, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { useNavigate } from "react-router-dom";

export default function DrawerList({ items, onItemClick, theme }) {
	const navigate = useNavigate();
    return (
        <Box sx={{ width: 275 }} role="presentation" onClick={onItemClick}>
            <List>
                {items.map((item) => (
                    <ListItem
                        key={item.text}
						onClick={() => navigate(item.path)}
                        sx={{
                            '&:hover': {
                                backgroundColor: theme.palette.secondary.main,
                                color: '#fff',
								cursor: 'pointer',
                                '& .MuiListItemIcon-root': { color: '#fff' },
                            },
                        }}
                    >
                        <ListItemIcon sx={{ minWidth: 32 }}>{item.icon}</ListItemIcon>
                        <ListItemText primary={item.text} />
                    </ListItem>
                ))}
            </List>
        </Box>
    );
}