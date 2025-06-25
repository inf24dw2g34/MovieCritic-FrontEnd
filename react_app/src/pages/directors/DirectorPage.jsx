import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container, Typography, Box, Paper, Divider, Chip, Alert, Card, CardContent
} from "@mui/material";
import { getDirectorById } from "../../api/directors";
import { getMoviesByDirectorId } from "../../api/movies"; // You may need to add this function to your API
import PersonIcon from '@mui/icons-material/Person';
import MovieIcon from '@mui/icons-material/Movie';

export default function DirectorPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [director, setDirector] = useState(null);
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        getDirectorById(id)
            .then(response => {
                setDirector(response.data);
                // Fetch movies by this director
                return getMoviesByDirectorId(id);
            })
            .then(response => {
                setMovies(response.data);
            })
            .catch(err => {
                console.error("Error loading director data:", err);
                setError("Failed to load director information.");
            });
    }, [id]);

    if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
    if (!director) return <Typography>Loading...</Typography>;

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <Box sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Typography variant="h3" gutterBottom>{director.name}</Typography>
                            <Chip
                                icon={<PersonIcon />}
                                label="Director"
                                variant="outlined"
                                sx={{ '& .MuiChip-label': { px: 1 } }}
                            />
                        </Box>
                    </Box>
                </Box>

                <Divider />
                <Box sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Movies ({movies.length})
                    </Typography>

                    {movies.length > 0 ? (
                        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 2 }}>
                            {movies.map(movie => (
                                <Card 
                                    key={movie.id} 
                                    sx={{ 
                                        cursor: 'pointer',
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        '&:hover': { 
                                            boxShadow: 6,
                                            transform: 'translateY(-2px)',
                                            transition: 'transform 0.2s ease-in-out'
                                        }
                                    }}
                                    onClick={() => navigate(`/movies/${movie.id}`)}
                                >
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Box display="flex" alignItems="center" mb={1}>
                                            <MovieIcon sx={{ color: 'primary.main', mr: 1 }} />
                                            <Typography variant="h6" noWrap>{movie.title}</Typography>
                                        </Box>
                                        <Typography variant="body2" color="text.secondary" gutterBottom>
                                            {movie.year} • {movie.duration} min
                                        </Typography>
                                        <Typography variant="body2" sx={{ mt: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                                            {movie.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                    ) : (
                        <Typography color="text.secondary">No movies found for this director.</Typography>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}