import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
    Box, 
    Button, 
    Container, 
    TextField, 
    Typography, 
    Alert,
    InputAdornment,
    Autocomplete
} from "@mui/material";
import { getMovieById, updateMovie } from "../../api/movies";
import { getDirectors } from "../../api/directors"; 
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PersonIcon from '@mui/icons-material/Person';

export default function EditMoviePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [directors, setDirectors] = useState([]);
    const [error, setError] = useState(null);

    // Fetch movie data
    useEffect(() => {
        getMovieById(id)
            .then(res => {
                setMovie(res.data);
                setError(null);
            })
            .catch(() => setError("Failed to load movie."))
    }, [id]);

    // Fetch directors list
    useEffect(() => {
        getDirectors()
            .then(res => {
                setDirectors(res.data);
            })
            .catch(err => {
                console.error("Error loading directors:", err);
            });
    }, []);

    const handleChange = (e) => {
        setMovie({ ...movie, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Ensure numeric fields are numbers
        const updatedMovie = {
            ...movie,
            year: parseInt(movie.year, 10),
            duration: parseInt(movie.duration, 10),
            directorId: parseInt(movie.directorId, 10) // Include directorId
        };
        
        updateMovie(id, updatedMovie)
            .then(() => navigate("/movies"))
            .catch(() => setError("Failed to update movie."))
    };

    if (error) return <Alert severity="error">{error}</Alert>;
    if (!movie) return null;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box
                sx={{
                    bgcolor: "#fff",
                    borderRadius: 2,
                    boxShadow: 2,
                    p: 4,
                }}
            >
                <Typography variant="h5" mb={3} color="black">Edit Movie</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Title"
                        name="title"
                        value={movie.title || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    
                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <TextField
                            label="Year"
                            name="year"
                            type="number"
                            value={movie.year || ""}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <CalendarTodayIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                        
                        <TextField
                            label="Duration (min)"
                            name="duration"
                            type="number"
                            value={movie.duration || ""}
                            onChange={handleChange}
                            fullWidth
                            margin="normal"
                            required
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <AccessTimeIcon />
                                    </InputAdornment>
                                ),
                            }}
                        />
                    </Box>
                    
                    {/* Director Selection using Autocomplete */}
                    <Autocomplete
                        id="director-select"
                        options={directors}
                        getOptionLabel={(option) => option.name || ""}
                        value={directors.find(d => d.id === movie.directorId) || null}
                        onChange={(_, newValue) => {
                            setMovie({ 
                                ...movie, 
                                directorId: newValue ? newValue.id : null 
                            });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Director"
                                margin="normal"
                                required
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                        <>
                                            <InputAdornment position="start">
                                                <PersonIcon />
                                            </InputAdornment>
                                            {params.InputProps.startAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                    
                    <TextField
                        label="Description"
                        name="description"
                        value={movie.description || ""}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        minRows={4}
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
                            onClick={() => navigate("/movies")}
                        >
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
}