import axios from "axios";

const api = axios.create({
	baseURL: 'http://localhost:3000',
	withCredentials: true
});

export function getDirectors() {
	return api.get('/directors');
}

export function getDirectorById(id) {
	return api.get(`/directors/${id}`);
}

export function createDirector(data) {
	return api.post('/directors', data);
}

export function updateDirector(id, data) {
	return api.put(`/directors/${id}`, data);
}

export function deleteDirector(id) {
	return api.delete(`/directors/${id}`)
}