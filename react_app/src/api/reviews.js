import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true // This is critical for sending cookies with requests
});

export function getReviews() {
  return api.get('/reviews');
}

export function getReviewById(id) {
  return api.get(`/reviews/${id}`);
}

export function getReviewsByMovieId(id) {
  return api.get(`/movies/${id}/reviews`);
}

export function createReview(data) {
  return api.post('/reviews', data);
}

export function updateReview(id, data) {
  return api.put(`/reviews/${id}`, data);
}

export function deleteReview(id) {
  return api.delete(`/reviews/${id}`);
}

export function getReviewsByUserId(userId) {
	return api.get(`users/${userId}/reviews`);
}
