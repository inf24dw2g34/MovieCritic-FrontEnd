import axios from "axios";

const api = axios.create({
  baseURL: 'http://localhost:3000',
  withCredentials: true
});

export function getUsers() {
  return api.get(`/users`);
}

export function getUserById(id) {
  return api.get(`/users/${id}`);
}

export function updateUserProfile(id, data) {
  return api.patch(`/users/${id}`, data);
}

export function deleteUser(id) {
  return api.delete(`/users/${id}`);
}