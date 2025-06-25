import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    Button,
    Container,
    TextField,
    Typography,
    Alert,
} from "@mui/material";
import { createReview } from "../../api/reviews";
import { getMovies } from "../../api/movies";
import Autocomplete from "@mui/material/Autocomplete";

export default function CreateReviewPage() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ movieId: "", content: "", rating: "" });
    const [error, setError] = useState(null);
    const [movies, setMovies] = useState([]);

    useEffect(() => {
        getMovies()
            .then((res) => setMovies(res.data))
            .catch(() => setError("Failed to load movies."))
    }, []);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        createReview({
            movieId: form.movieId,
            content: form.content,
            rating: form.rating,
        })
            .then(() => navigate("/reviews"))
            .catch(() => setError("Failed to create review."))
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
                <Typography variant="h5" mb={3} color="black" >
                    Create Review
                </Typography>
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}
                <form onSubmit={handleSubmit}>
                    <Autocomplete
                        options={movies}
                        getOptionLabel={(option) => option.title || ""}
                        value={movies.find(m => m.id === form.movieId) || null}
                        onChange={(_, newValue) => {
                            setForm({ ...form, movieId: newValue ? newValue.id : "" });
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Movie"
                                margin="normal"
                                required
                            />
                        )}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                    />
                    <TextField
                        label="Content"
                        name="content"
                        value={form.content}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        multiline
                        minRows={3}
                        required
                    />
                    <TextField
                        label="Rating"
                        name="rating"
                        type="number"
                        value={form.rating}
                        onChange={handleChange}
                        fullWidth
                        margin="normal"
                        required
                    />
                    <Box mt={2} display="flex" gap={2}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="secondary"
                        >
                            Create
                        </Button>
                        <Button variant="outlined" onClick={() => navigate("/reviews")}>
                            Cancel
                        </Button>
                    </Box>
                </form>
            </Box>
        </Container>
    );
}