import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

export function getUsersLikedMovie(movieId) {
  return api.get(`/movies/${movieId}/likes`);
}

export function likeMovie(movieId) {
  return api.post(`/movies/${movieId}/likes`);
}

export function unlikeMovie(movieId) {
  return api.delete(`/movies/${movieId}/likes`);
}

export function getLikedMoviesByUserId(userId) {
	return api.get(`/users/${userId}/likes`);
} 