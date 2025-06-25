import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { AuthProvider } from "./context/AuthContext";
import ReviewsPage from "./pages/reviews/reviewsPage";
import EditReviewPage from "./pages/reviews/EditReviewPage";
import CreateReviewPage from "./pages/reviews/CreateReviewPage";

import MoviesPage from "./pages/movies/moviesPage";
import MoviePage from "./pages/movies/MoviePage";
import EditMoviePage from "./pages/movies/EditMoviePage";
import CreateMoviePage from "./pages/movies/CreateMoviePage";

import DirectorsPage from "./pages/directors/DirectorsPage";
import CreateDirectorPage from "./pages/directors/CreateDirectorPage";
import DirectorPage from "./pages/directors/DirectorPage";
import EditDirectorPage from "./pages/directors/EditDirectorPage";
import UserProfilePage from "./pages/users/UserProfilePage";
import EditUserPage from "./pages/users/EditUserPage";
import UserSettingsPage from "./pages/users/UserSettingsPage";
import UsersPage from "./pages/users/usersPage";
import HomePage from "./pages/homePage";
import Navbar from "./components/Navbar/Navbar";

const theme = createTheme({
	palette: {
		primary: {
			main: "#292929",
			light: "#3d3d3d",
		},
		secondary: {
			main: "#C10BB8",
			light: "#DC2ED3",
			dark: "#8a0883"
		},
	},
});

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<AuthProvider>
				<BrowserRouter>
					<Navbar />
					<Routes>
						<Route path="/" element={<HomePage />} />

						<Route path="/reviews">
							<Route index element={<ReviewsPage />} />
							<Route path="edit/:id" element={<EditReviewPage />} />
							<Route path="create" element={<CreateReviewPage />} />
						</Route>

						<Route path="/movies">
							<Route index element={<MoviesPage />} />
							<Route path=":id" element={<MoviePage />} />
							<Route path="edit/:id" element={<EditMoviePage />} />
							<Route path="create" element={<CreateMoviePage />} />
						</Route>

						<Route path="/directors">
							<Route index element={<DirectorsPage />} />
							<Route path=":id" element={<DirectorPage />} />
							<Route path="create" element={<CreateDirectorPage />} />
							<Route path="edit/:id" element={<EditDirectorPage />} />
						</Route>
						<Route path="/users">
							<Route index element={<UsersPage />} />
							<Route path=":id" element={<UserProfilePage />} />
							<Route path="edit/:id" element={<EditUserPage />} />
							<Route path="settings" element={<UserSettingsPage />} />
						</Route>
						<Route path="*" element={<Navigate to="/" />} />
					</Routes>
				</BrowserRouter>
			</AuthProvider>
		</ThemeProvider>
	);
}