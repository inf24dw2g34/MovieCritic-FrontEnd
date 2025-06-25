import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true // This is critical for sending cookies with requests
});

export function getMovies() {
  return api.get('/movies');
}

export function getMovieById(id) {
  return api.get(`/movies/${id}`);
}

export function createMovie(data) {
  return api.post('/movies', data);
}

export function updateMovie(id, data) {
  return api.put(`/movies/${id}`, data);
}

export function deleteMovie(id) {
  return api.delete(`/movies/${id}`);
}

export function getMoviesByDirectorId(directorId) {
	return api.get(`directors/${directorId}/movies`);
}
