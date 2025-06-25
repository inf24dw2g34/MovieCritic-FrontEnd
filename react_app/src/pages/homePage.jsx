import React, { useState, useEffect } from "react";
import { 
  Container, Box, Typography, Grid, Card, CardContent, 
  CardMedia, Button, Chip, Skeleton, Paper,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getMovies } from "../api/movies"; 
import { getDirectors } from "../api/directors";
import { getUsersLikedMovie } from "../api/likes"; // Import the correct function
import MovieIcon from '@mui/icons-material/Movie';
import TheatersIcon from '@mui/icons-material/Theaters';
import FavoriteIcon from '@mui/icons-material/Favorite'; // Changed from TrendingUp to Favorite
import LocalMoviesIcon from '@mui/icons-material/LocalMovies';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';

export default function HomePage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [topMovies, setTopMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    movies: 0,
    directors: 0,
  });

  useEffect(() => {
    setLoading(true);
    
    // most liked movies
    const fetchData = async () => {
      try {
        // get movies 
        const moviesResponse = await getMovies();
        const movies = moviesResponse.data;
        
        // get likes for each movie
        const moviesWithLikePromises = movies.map(async (movie) => {
          try {
            const likesResponse = await getUsersLikedMovie(movie.id);
            const likes = likesResponse.data;
            
            return {
              ...movie,
              likesCount: likes.length,
              likes: likes
            };
          } catch (err) {
            console.error(`Failed to fetch likes for movie ${movie.id}:`, err);
            return {
              ...movie,
              likesCount: 0,
              likes: []
            };
          }
        });
        
        // run promises at the same time
        const moviesWithLikes = await Promise.all(moviesWithLikePromises);
        
        // sort by most likes
        const sortedMovies = [...moviesWithLikes]
          .sort((a, b) => b.likesCount - a.likesCount)
          .slice(0, 3);
        
        setTopMovies(sortedMovies.map(movie => ({
          id: movie.id,
          title: movie.title,
          year: movie.year,
          likes: movie.likesCount,
          imageUrl: `https://picsum.photos/seed/movie${movie.id}/500/300`
        })));
        
        const directorsResponse = await getDirectors();
        
        setStats({
          movies: movies.length,
          directors: directorsResponse.data.length
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <Box>
      <Box 
        sx={{ 
          background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.85)), url(https://picsum.photos/seed/hero/1600/800)`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          color: 'white',
          py: 12,
          mb: 6
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ maxWidth: '800px' }}>
            <Typography 
              variant="h2" 
              component="h1" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                textShadow: '0 2px 10px rgba(0,0,0,0.3)'
              }}
            >
              Welcome to MovieCritic
            </Typography>
            <Typography 
              variant="h5" 
              sx={{ 
                mb: 4,
                opacity: 0.9,
                textShadow: '0 2px 5px rgba(0,0,0,0.2)'
              }}
            >
              Discover, review and share your thoughts on the best movies from around the world.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large"
                onClick={() => navigate('/movies')}
                startIcon={<MovieIcon />}
              >
                Browse Movies
              </Button>
              {!user && (
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{ color: 'white', borderColor: 'white' }}
                  onClick={() => { window.location.href = "http://localhost:3000/auth/google"; }}
                >
                  Sign In to Review
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Stats Section */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Paper 
          elevation={3} 
          sx={{
            borderRadius: 2,
            overflow: 'hidden',
            p: { xs: 3, sm: 4 },
            backgroundColor: 'rgba(255,255,255,0.98)'
          }}
        >
          <Grid 
            container 
            spacing={0} 
            sx={{ 
              justifyContent: 'space-around',
              alignItems: 'center'
            }}
          >
            <Grid 
              item 
              xs={12} 
              sm={4} 
              sx={{ 
                pb: { xs: 3, sm: 0 },
                pt: { xs: 2, sm: 0 }
              }}
            >
              <Box sx={{ 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                px: 3,
                py: 2
              }}>
                <MovieIcon sx={{ fontSize: 50, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h3" fontWeight={700}>
                  {loading ? <Skeleton width={80} /> : stats.movies}
                </Typography>
                <Typography variant="h6" color="text.secondary">Movies</Typography>
              </Box>
            </Grid>
            
            <Grid 
              item 
              xs={12} 
              sm={4} 
              sx={{ 
                py: { xs: 3, sm: 0 }
              }}
            >
              <Box sx={{ 
                textAlign: 'center',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                px: 3,
                py: 2
              }}>
                <TheatersIcon sx={{ fontSize: 50, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h3" fontWeight={700}>
                  {loading ? <Skeleton width={80} /> : stats.directors}
                </Typography>
                <Typography variant="h6" color="text.secondary">Directors</Typography>
              </Box>
            </Grid>
            
            
          </Grid>
        </Paper>
      </Container>

      {/* Featured Movies Section - now "Most Liked Movies" */}
      <Box sx={{ bgcolor: 'rgba(0,0,0,0.03)', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography variant="h4" component="h2" fontWeight={600}>
              <FavoriteIcon sx={{ mr: 1, verticalAlign: 'bottom', color: 'secondary.main' }} />
              Most Liked Movies
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/movies')}
              endIcon={<LocalMoviesIcon />}
			  color="white"
            >
              See All
            </Button>
          </Box>
          
          <Grid container spacing={3}>
            {loading ? (
              // Skeleton loaders
              Array.from(new Array(3)).map((_, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Card sx={{ borderRadius: 2, height: '100%' }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={32} />
                      <Skeleton variant="text" width="60%" />
                      <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                        <Skeleton variant="circular" width={24} height={24} sx={{ mr: 1 }} />
                        <Skeleton width={100} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : topMovies.length > 0 ? (
              // Actual movie cards - show likes instead of ratings
              topMovies.map((movie) => (
                <Grid item key={movie.id} xs={12} sm={6} md={4}>
                  <Card 
                    sx={{ 
                      borderRadius: 2, 
                      height: '100%',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 8
                      },
                      cursor: 'pointer'
                    }}
                    onClick={() => navigate(`/movies/${movie.id}`)}
                  >
                    <CardMedia
                      component="img"
                      height={200}
                      image={movie.imageUrl}
                      alt={movie.title}
                    />
                    <CardContent>
                      <Typography variant="h5" component="div" gutterBottom>
                        {movie.title}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip label={movie.year} size="small" />
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <ThumbUpIcon sx={{ fontSize: 18, color: 'primary.main', mr: 0.5 }} />
                          <Typography variant="body2">
                            {movie.likes} {movie.likes === 1 ? 'like' : 'likes'}
                          </Typography>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              // No movies found
              <Box width="100%" textAlign="center" py={4}>
                <Typography variant="body1" color="white">
                  No movies available.
                </Typography>
              </Box>
            )}
          </Grid>
        </Container>
      </Box>
      
      {/* Call to Action */}
      <Box 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          py: 8,
          mt: 6
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom fontWeight={600}>
            Ready to share your thoughts?
          </Typography>
          <Typography variant="body1" sx={{ mb: 4, opacity: 0.9 }}>
            Join our community of movie enthusiasts to review your favorite films
            and discover new recommendations.
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => user ? navigate('/reviews') : window.location.href = "http://localhost:3000/auth/google"}
          >
            {user ? "Write a Review" : "Sign In Now"}
          </Button>
        </Container>
      </Box>
    </Box>
  );
}