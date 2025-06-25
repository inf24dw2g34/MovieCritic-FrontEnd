import React, { useState, useEffect } from "react";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    Alert,
    Snackbar,
    Divider
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import { updateUserProfile } from "../../api/users";
import PersonIcon from '@mui/icons-material/Person';

export default function UserSettingsPage() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        name: "",
        profile_picture: ""
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [previewImage, setPreviewImage] = useState("");

    // Load user data when component mounts
    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || "",
                profile_picture: user.profile_picture || ""
            });
            setPreviewImage(user.profile_picture || "");
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));

        // Update preview image when URL changes
        if (name === 'profile_picture') {
            setPreviewImage(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        
        if (!user || !user.id) {
            setError("User information not available");
            return;
        }
        
        try {
            const response = await updateUserProfile(user.id, form);
            setSuccess(true);
            
            // Update the user context with new data
            if (updateUser) {
                updateUser(response.data);
            }
            
            setTimeout(() => setSuccess(false), 5000);
        } catch (err) {
            console.error("Failed to update profile:", err);
            setError("Failed to update your profile. Please try again.");
        }
    };

    if (!user) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="warning">Please log in to access your settings.</Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: "primary.main", p: 3, color: "white" }}>
                    <Typography variant="h5">Account Settings</Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                mb: 2
                            }}>
                                <Avatar 
                                    src={previewImage}
                                    alt={form.name}
                                    sx={{ 
                                        width: 100, 
                                        height: 100, 
                                        fontSize: 40,
                                        mb: 2,
                                        bgcolor: 'secondary.main'
                                    }}
                                >
                                    {form.name?.charAt(0) || user.name?.charAt(0) || <PersonIcon />}
                                </Avatar>
                                <Typography variant="body2" color="text.secondary">
                                    Profile Preview
                                </Typography>
                            </Box>

                            <Divider />

                            <TextField
                                label="Name"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                fullWidth
                                required
                            />

                            <TextField
                                label="Profile Picture URL"
                                name="profile_picture"
                                value={form.profile_picture}
                                onChange={handleChange}
                                fullWidth
                                placeholder="https://example.com/your-image.jpg"
                                helperText="Enter a URL to an image (JPG, PNG, etc.)"
                            />

                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                sx={{ mt: 2, alignSelf: 'flex-start' }}
                            >
                                {"Save Changes"}
                            </Button>
                        </Box>
                    </form>
                </Box>
            </Paper>

            <Snackbar
                open={success}
                autoHideDuration={5000}
                onClose={() => setSuccess(false)}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity="success" variant="filled">
                    Profile updated successfully!
                </Alert>
            </Snackbar>
        </Container>
    );
}