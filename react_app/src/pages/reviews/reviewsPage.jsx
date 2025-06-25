import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ResourceTable from "../../components/ResourceTable/ResourceTable";
import { getReviews, deleteReview } from "../../api/reviews";
import { useNavigate } from "react-router-dom";

export default function ReviewsPage() {
	const navigate = useNavigate();
	const [reviews, setReviews] = useState([]);
	const [error, setError] = useState(null);

	useEffect(() => {
		getReviews()
			.then((response) => {
				setReviews(response.data);
				setError(null);
			})
			.catch((error) => {
				console.error("Error fetching reviews:", error);
				setError("Failed to load reviews.");
			})
	}, []);

	function deletePostHandler(event) {
		const deletedId = event.currentTarget.dataset.index;
		deleteReview(deletedId)
			.then(() => {
				setReviews((prev) => prev.filter(
					(review) => String(review.id) !== String(deletedId)
				));
			})
			.catch(error => {
				console.error("Error deleting review:", error);
				setError("Failed to delete review.");
			})
	}

	return (
		<Container maxWidth="lg" sx={{ py: 4 }}>
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
				<Typography variant="h4" component="h1">
					Reviews
				</Typography>
				<Button
					variant="contained"
					color="secondary"
					startIcon={<AddIcon />}
					onClick={() => navigate("/reviews/create")}
				>
					Create Review
				</Button>
			</Box>

			{error && (
				<Alert severity="error" sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<ResourceTable
				data={reviews}
				columns={["id", "movie", "content", "rating", "createdAt"]}
				onDelete={deletePostHandler}
				title="My Reviews"
				resource="reviews"
				hasPermissions={ true }
			/>
		</Container>
	);
}