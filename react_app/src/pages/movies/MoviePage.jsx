import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Container, Typography, Box, Paper, Avatar,
    Rating, Chip, Card, CardContent, List, ListItem,
    ListItemAvatar, ListItemText, Alert, Divider, CardMedia, 
    Button, IconButton, Tooltip
} from "@mui/material";
import { getMovieById } from "../../api/movies";
import { getReviewsByMovieId } from "../../api/reviews";
import { getUsersLikedMovie, likeMovie, unlikeMovie } from "../../api/likes";
import { useAuth } from "../../context/AuthContext";  // Import useAuth
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbUpOutlinedIcon from '@mui/icons-material/ThumbUpOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RateReviewIcon from '@mui/icons-material/RateReview';
import PersonIcon from '@mui/icons-material/Person';

export default function MoviePage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movie, setMovie] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [likedBy, setLikedBy] = useState([]);
    const [error, setError] = useState(null);
    const [isLiked, setIsLiked] = useState(false);
    const { user } = useAuth();

    useEffect(() => {
        getMovieById(id)
            .then(response => {
                setMovie(response.data);
                return getReviewsByMovieId(id);
            })
            .then(response => {
                setReviews(response.data);
                return getUsersLikedMovie(id);
            })
            .then(response => {
                const likes = response.data;
                setLikedBy(likes);
                
                if (user && likes.some(like => like.id === user.id)) {
                    setIsLiked(true);
                }
            })
            .catch(err => {
                console.error("Error loading movie data:", err);
                setError("Failed to load movie information.");
            });
    }, [id, user]);

    const handleLikeToggle = () => {
        if (!user) {
            setError("Please log in to like movies");
            return;
        }

        const action = isLiked ? unlikeMovie(id) : likeMovie(id);
        
        action.then(response => {
            setIsLiked(!isLiked);
            
            if (isLiked) {
                setLikedBy(likedBy.filter(like => like.id !== user.id));
            } else {
                setLikedBy([...likedBy, user]);
            }
        })
        .catch(err => {
            console.error("Error updating like status:", err);
            setError("Failed to update like status");
        });
    };

    const handleCreateReview = () => {
        navigate(`/reviews/create?movieId=${id}`);
    };

    if (error) return <Container sx={{ py: 4 }}><Alert severity="error">{error}</Alert></Container>;
    if (!movie) return <Typography>Movie not found</Typography>;

    // Calculate average rating
    const avgRating = reviews.length > 0
        ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
        : 0;

    // Random image
    const imageSeed = Math.floor(Math.random() * 1000);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Paper elevation={3} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    height="300"
                    image={`https://picsum.photos/seed/${imageSeed}/1200/300`}
                    alt="Random movie banner"
                    sx={{ objectFit: "cover" }}
                />

                <Box sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                        <Box>
                            <Typography variant="h3" gutterBottom>{movie.title}</Typography>
                            <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                                <Chip
                                    icon={<StarIcon sx={{ color: "#FFD700 !important" }} />}
                                    label={reviews.length > 0 ? `${avgRating.toFixed(1)}/5` : "No ratings"}
                                    variant="outlined"
                                    sx={{ mr: 2, '& .MuiChip-label': { px: 1 } }}
                                />
                                <Chip
                                    icon={<CalendarTodayIcon />}
                                    label={movie.year}
                                    variant="outlined"
                                    sx={{ mr: 2, '& .MuiChip-label': { px: 1 } }}
                                />
                                <Chip
                                    icon={<AccessTimeIcon />}
                                    label={`${movie.duration} min`}
                                    variant="outlined"
                                    sx={{ mr: 2, '& .MuiChip-label': { px: 1 } }}
                                />

                                {movie.Director && (
                                    <Tooltip title={`View director: ${movie.Director.name}`}>
                                        <Chip
                                            icon={<PersonIcon />}
                                            label={movie.Director.name}
                                            variant="outlined"
                                            onClick={() => navigate(`/directors/${movie.Director.id}`)}
                                            sx={{ 
                                                '& .MuiChip-label': { px: 1 },
                                                cursor: 'pointer',
                                                '&:hover': { 
                                                    bgcolor: 'rgba(0, 0, 0, 0.04)',
                                                    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                                }
                                            }}
                                        />
                                    </Tooltip>
                                )}
                            </Box>
                        </Box>
                        

                        <Box display="flex" alignItems="center">
                            <Chip
                                label={`${likedBy.length} likes`}
                                color="primary"
                                variant="outlined"
                                sx={{ mr: 1, '& .MuiChip-label': { px: 1 } }}
                            />
                            <Tooltip title={isLiked ? "Unlike" : "Like"}>
                                <IconButton 
                                    onClick={handleLikeToggle} 
                                    color="primary"
                                    sx={{ ml: 1 }}
                                >
                                    {isLiked ? <ThumbUpIcon color="secondary" /> : <ThumbUpOutlinedIcon />}
                                </IconButton>
                            </Tooltip>
                        </Box>
                    </Box>

                    <Typography variant="body1" sx={{ mt: 2 }}>
                        {movie.description}
                    </Typography>
                </Box>

                <Divider />
                <Box sx={{ p: 3 }}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h5">
                            Reviews ({reviews.length})
                        </Typography>
                        
                        {user && (
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<RateReviewIcon />}
                                onClick={handleCreateReview}
                                size="medium"
                            >
                                Write Review
                            </Button>
                        )}
                    </Box>

                    <Box sx={{ width: '100%' }}>
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
                                            <Box display="flex" alignItems="center">
                                                <Avatar 
                                                    src={review.User?.profile_picture} 
                                                    sx={{ mr: 2, cursor: 'pointer' }}
                                                    onClick={() => navigate(`/users/${review.User?.id}`)}
                                                >
                                                    {review.User?.name?.charAt(0) || "U"}
                                                </Avatar>
                                                <Typography 
                                                    variant="subtitle1"
                                                    sx={{ 
                                                        cursor: 'pointer',
                                                        '&:hover': { 
                                                            color: 'secondary.main', 
                                                            textDecoration: 'underline' 
                                                        }
                                                    }}
                                                    onClick={() => review.User?.id && navigate(`/users/${review.User.id}`)}
                                                >
                                                    {review.User?.name || "Anonymous"}
                                                </Typography>
                                            </Box>
                                            <Box display="flex" alignItems="center">
                                                <Rating value={review.rating} readOnly size="small" />
                                            </Box>
                                        </Box>
                                        <Typography variant="body1" sx={{ wordBreak: 'break-word' }}>
                                            {review.content}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))
                        ) : (
                            <Typography color="text.secondary">No reviews yet for this movie.</Typography>
                        )}
                    </Box>
                </Box>

                <Divider />
                <Box sx={{ p: 3 }}>
                    <Typography variant="h5" gutterBottom>
                        Liked By ({likedBy.length})
                    </Typography>

                    {likedBy.length > 0 ? (
                        <List sx={{ p: 0 }}>
                            {likedBy.map(user => (
                                <ListItem 
                                    key={user.id}
                                    sx={{ 
                                        cursor: 'pointer', 
                                        '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' }
                                    }}
                                    onClick={() => navigate(`/users/${user.id}`)}
                                >
                                    <ListItemAvatar>
                                        <Avatar src={user.profile_picture}>{user.name.charAt(0)}</Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={
                                            <Typography 
                                                sx={{ 
                                                    '&:hover': { 
                                                        color: 'secondary.main',
                                                    }
                                                }}
                                            >
                                                {user.name}
                                            </Typography>
                                        } 
                                    />
                                </ListItem>
                            ))}
                        </List>
                    ) : (
                        <Typography color="text.secondary">No likes yet for this movie.</Typography>
                    )}
                </Box>
            </Paper>
        </Container>
    );
}