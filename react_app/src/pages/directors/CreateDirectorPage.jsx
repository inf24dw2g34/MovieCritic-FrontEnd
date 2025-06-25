import React, { useState } from "react";
import { Box, Button, Container, TextField, Typography, Alert } from "@mui/material";
import { createDirector } from "../../api/directors";
import { useNavigate } from "react-router-dom";

export default function CreateDirectorPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ name: "" });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createDirector(form)
            .then(() => navigate("/directors"))
            .catch(() => setError("Failed to create director."));
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Box
                sx={{
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: 2,
                    p: 4,
                }}
            >
                <Typography variant="h5" mb={3} color="black">
                    Create Director
                </Typography>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    
                    <Box mt={3} display="flex" gap={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                        >
                            Create
                        </Button>
                        <Button 
                            variant="outlined" 
                            onClick={() => navigate("/directors")}
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
}