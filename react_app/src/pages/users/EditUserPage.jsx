import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Avatar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Divider,
    CircularProgress
} from "@mui/material";
import { getUserById, updateUserProfile } from "../../api/users";
import { useAuth } from "../../context/AuthContext";
import SaveIcon from '@mui/icons-material/Save';
import PersonIcon from '@mui/icons-material/Person';
import ImageIcon from '@mui/icons-material/Image';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

export default function EditUserPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [previewImage, setPreviewImage] = useState("");
    const { user } = useAuth();
    const isAdmin = user && user.role === "admin";

    // Fetch user data
    useEffect(() => {
        // Redirect non-admin users
        if (!isAdmin) {
            navigate("/");
            return;
        }

        getUserById(id)
            .then(response => {
                setUserData(response.data);
                setPreviewImage(response.data.profile_picture || "");
                setError(null);
                setLoading(false);
            })
            .catch(err => {
                console.error("Error loading user:", err);
                setError("Failed to load user information.");
                setLoading(false);
            });
    }, [id, isAdmin, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'profile_picture') {
            setPreviewImage(value);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        
        try {
            await updateUserProfile(id, userData);
            navigate("/users");
        } catch (err) {
            console.error("Failed to update user:", err);
            setError("Failed to update user. Please try again.");
            setSaving(false);
        }
    };

    if (!isAdmin) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    You don't have permission to access this page.
                </Alert>
            </Container>
        );
    }

    if (loading) {
        return (
            <Container maxWidth="md" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
                <CircularProgress />
            </Container>
        );
    }

    if (!userData) {
        return (
            <Container maxWidth="md" sx={{ py: 4 }}>
                <Alert severity="error">
                    User not found.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ bgcolor: "primary.main", p: 3, color: "white" }}>
                    <Typography variant="h5">Edit User</Typography>
                </Box>

                <Box sx={{ p: 4 }}>
                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                            {/* Profile Preview */}
                            <Box sx={{ 
                                display: 'flex', 
                                flexDirection: 'column', 
                                alignItems: 'center',
                                mb: 2
                            }}>
                                <Avatar 
                                    src={previewImage}
                                    alt={userData.name}
                                    sx={{ 
                                        width: 100, 
                                        height: 100, 
                                        fontSize: 40,
                                        mb: 2,
                                        bgcolor: 'secondary.main'
                                    }}
                                >
                                    {userData.name?.charAt(0) || <PersonIcon />}
                                </Avatar>
                                <Typography variant="body2" color="text.secondary">
                                    Profile Preview
                                </Typography>
                            </Box>

                            <Divider />
                            
                            {/* User ID (read-only) */}
                            <TextField
                                label="User ID"
                                value={userData.id || ""}
                                disabled
                                fullWidth
                            />

                            {/* Name Field */}
                            <TextField
                                label="Name"
                                name="name"
                                value={userData.name || ""}
                                onChange={handleChange}
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                            />

                            {/* Role Selection */}
                            <FormControl fullWidth required>
                                <InputLabel id="role-select-label">Role</InputLabel>
                                <Select
                                    labelId="role-select-label"
                                    id="role-select"
                                    name="role"
                                    value={userData.role || "user"}
                                    onChange={handleChange}
                                    startAdornment={<AdminPanelSettingsIcon sx={{ mr: 1, color: 'text.secondary' }} />}
                                >
                                    <MenuItem value="user">User</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                </Select>
                            </FormControl>

                            {/* Profile Picture URL */}
                            <TextField
                                label="Profile Picture URL"
                                name="profile_picture"
                                value={userData.profile_picture || ""}
                                onChange={handleChange}
                                fullWidth
                                placeholder="https://example.com/profile.jpg"
                                helperText="Enter a URL to an image (JPG, PNG, etc.)"
                                InputProps={{
                                    startAdornment: <ImageIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                                }}
                            />

                            {/* Action Buttons */}
                            <Box mt={3} display="flex" gap={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    disabled={saving}
                                    startIcon={saving ? <CircularProgress size={24} /> : <SaveIcon />}
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </Button>
                                <Button 
                                    variant="outlined" 
                                    onClick={() => navigate("/users")}
                                >
                                    Cancel
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Box>
            </Paper>
        </Container>
    );
}