import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Box, Button, Container, TextField, Typography, Alert } from "@mui/material";
import { getReviewById, updateReview } from "../../api/reviews";

export default function EditReviewPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const [review, setReview] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		getReviewById(id)
			.then(res => {
				setReview(res.data);
				setError(null);
			})
			.catch(() => setError("Failed to load review."))
	}, [id]);

	const handleChange = (e) => {
		setReview({ ...review, [e.target.name]: e.target.value });
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		updateReview(id, review)
			.then(() => navigate("/reviews"))
			.catch(() => setError("Failed to update review."))
	};

	if (error) return <Alert severity="error">{error}</Alert>;
	if (!review) return null;

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
				<Typography variant="h5" mb={3} color="black">Edit Review</Typography>
				<form onSubmit={handleSubmit}>
					<TextField
						label="Content"
						name="content"
						value={review.content || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
						multiline
						minRows={3}
					/>
					<TextField
						label="Rating"
						name="rating"
						type="number"
						value={review.rating || ""}
						onChange={handleChange}
						fullWidth
						margin="normal"
					/>
					<Box mt={2} display="flex" gap={2}>
						<Button
							type="submit"
							variant="contained"
							color="secondary"
						>
							Save
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