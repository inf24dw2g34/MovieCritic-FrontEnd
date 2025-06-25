import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Box, 
    Button, 
    Container, 
    TextField, 
    Typography, 
    Alert
} from "@mui/material";
import { getDirectorById, updateDirector } from "../../api/directors";

export default function EditDirectorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [director, setDirector] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        getDirectorById(id)
            .then(res => {
                setDirector(res.data);
                setError(null);
            })
            .catch(() => setError("Failed to load director."))
    }, [id]);

    const handleChange = (e) => {
        setDirector({ ...director, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateDirector(id, director)
            .then(() => navigate("/directors"))
            .catch(() => setError("Failed to update director."))
    };

    if (error) return <Alert severity="error">{error}</Alert>;
    if (!director) return null;

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
                <Typography variant="h5" mb={3} color="black">Edit Director</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Name"
                        name="name"
                        value={director.name || ""}
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
                            Save Changes
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