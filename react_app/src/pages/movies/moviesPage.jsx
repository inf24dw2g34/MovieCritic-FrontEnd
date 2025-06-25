import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ResourceTable from "../../components/ResourceTable/ResourceTable";
import { getMovies, deleteMovie } from "../../api/movies";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function MoviesPage() {
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    
    const isAdmin = user && user.role === "admin";

    useEffect(() => {
        getMovies()
            .then((response) => {
                setMovies(response.data);
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching movies:", error);
                setError("Failed to load movies.");
            });
    }, []);

    function deleteMovieHandler(event) {
        const deletedId = event.currentTarget.dataset.index;
        deleteMovie(deletedId)
            .then(() => {
                setMovies((prev) => prev.filter(
                    (movie) => String(movie.id) !== String(deletedId)
                ));
            })
            .catch(error => {
                console.error("Error deleting movie:", error);
                setError("Failed to delete movie.");
            });
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Movies
                </Typography>
                {isAdmin && (
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/movies/create")}
                    >
                        Create Movie
                    </Button>
                )}
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <ResourceTable
                data={movies}
                columns={["id", "title", "description", "duration", "year", "Director"]}
                onDelete={deleteMovieHandler}
                title="Movies"
                resource="movies"
                hasPermissions={isAdmin}
            />
        </Container>
    );
}