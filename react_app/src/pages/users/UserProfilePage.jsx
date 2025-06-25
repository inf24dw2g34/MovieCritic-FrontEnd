import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container, Typography, Box, Paper, Avatar, Tabs, Tab,
    Rating, Chip, Card, CardContent, Alert, Grid
} from "@mui/material";
import { getUserById } from "../../api/users";
import { getReviewsByUserId } from "../../api/reviews";
import { getLikedMoviesByUserId } from "../../api/likes";
import PersonIcon from '@mui/icons-material/Person';
import MovieIcon from '@mui/icons-material/Movie';
import RateReviewIcon from '@mui/icons-material/RateReview';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export default function UserProfilePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [likedMovies, setLikedMovies] = useState([]);
    const [error, setError] = useState(null);
    const [tabValue, setTabValue] = useState(0);

    useEffect(() => {
        // Fetch user details
        getUserById(id)
            .then(response => {
                setUser(response.data);
                return getReviewsByUserId(id);
            })
            .then(response => {
                setReviews(response.data);
                return getLikedMoviesByUserId(id);
            })
            .then(response => {
                setLikedMovies(response.data);
            })
            .catch(err => {
                console.error("Error loading user data:", err);
                setError("Failed to load user information.");
            });
    }, [id]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
    };

    if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
    if (!user) return <Typography align="center" py={4}>Loading...</Typography>;

    const nameInitial = user.name ? user.name.charAt(0).toUpperCase() : "U";

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>

                <Box sx={{ bgcolor: "primary.main", p: 4, color: "white" }}>
                    <Box display="flex" alignItems="center" gap={3}>
                        <Avatar 
                            src={user.profile_picture} 
                            alt={user.name}
                            sx={{ width: 100, height: 100, fontSize: 40 }}
                        >
                            {nameInitial}
                        </Avatar>
                        <Box>
                            <Typography variant="h3">{user.name}</Typography>
                            <Chip 
                                icon={<PersonIcon />} 
                                label={user.role || "User"} 
                                sx={{ 
                                    bgcolor: "rgba(255,255,255,0.2)", 
                                    color: "white",
                                    mt: 1
                                }} 
                            />
                        </Box>
                    </Box>
                </Box>

                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs 
                        value={tabValue} 
                        onChange={handleTabChange} 
                        centered
                        sx={{ mt: 2 }}
                    >
                        <Tab 
                            icon={<RateReviewIcon />} 
                            iconPosition="start" 
                            label={`Reviews (${reviews.length})`} 
                        />
                        <Tab 
                            icon={<ThumbUpIcon />} 
                            iconPosition="start" 
                            label={`Liked Movies (${likedMovies.length})`} 
                        />
                    </Tabs>
                </Box>

                <Box sx={{ p: 3, display: tabValue === 0 ? 'block' : 'none' }}>
                    {reviews.length > 0 ? (
                        reviews.map(review => (
                            <Card
                                key={review.id}
                                sx={{
                                    mb: 3,
                                    width: '100%',
                                    borderRadius: 2,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                                    '&:last-child': { mb: 0 }
                                }}
                            >
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                                        <Box>
                                            <Typography 
                                                variant="h6" 
                                                sx={{ 
                                                    cursor: 'pointer',
                                                    color: 'primary.main',
                                                    '&:hover': {
                                                        textDecoration: 'underline'
                                                    }
                                                }}
                                                onClick={() => review.Movie && navigate(`/movies/${review.Movie.id}`)}
                                            >
                                                {review.Movie ? review.Movie.title : "Unknown Movie"}
                                            </Typography>
                                            {review.Movie && (
                                                <Typography variant="body2" color="text.secondary">
                                                    {review.Movie.year} • {review.Movie.duration} min
                                                </Typography>
                                            )}
                                        </Box>
                                        <Box display="flex" alignItems="center">
                                            <Rating value={review.rating} readOnly size="small" />
                                        </Box>
                                    </Box>
                                    <Typography variant="body1">
                                        {review.content}
                                    </Typography>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <Typography color="text.secondary" align="center">
                            This user hasn't written any reviews yet.
                        </Typography>
                    )}
                </Box>

                <Box sx={{ p: 3, display: tabValue === 1 ? 'block' : 'none' }}>
                    {likedMovies.length > 0 ? (
                        <Grid container spacing={2}>
                            {likedMovies.map(movie => (
                                <Grid item xs={12} sm={6} md={4} key={movie.id}>
                                    <Card 
                                        sx={{ 
                                            height: '100%',
                                            cursor: 'pointer',
                                            transition: 'transform 0.2s, box-shadow 0.2s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4
                                            }
                                        }}
                                        onClick={() => navigate(`/movies/${movie.id}`)}
                                    >
                                        <CardContent>
                                            <Box display="flex" alignItems="center" mb={1}>
                                                <MovieIcon sx={{ color: 'secondary.main', mr: 1 }} />
                                                <Typography variant="h6" noWrap>
                                                    {movie.title}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" color="text.secondary" gutterBottom>
                                                {movie.year} • {movie.duration} min
                                            </Typography>
                                            <Typography variant="body2" sx={{
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 3,
                                                WebkitBoxOrient: 'vertical'
                                            }}>
                                                {movie.description}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography color="text.secondary" align="center">
                            This user hasn't liked any movies yet.
                        </Typography>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}