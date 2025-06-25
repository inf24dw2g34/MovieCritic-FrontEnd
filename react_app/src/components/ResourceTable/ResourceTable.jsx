import React, { useState } from "react";
import {
	Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
	Paper, IconButton, TablePagination, Box, Typography, Tooltip,
	Dialog, DialogTitle, DialogContent, DialogActions, Button
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StarIcon from '@mui/icons-material/Star';
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

export default function ResourceTable({
	data,
	columns,
	onDelete,
	title = "Resource Table",
	resource,
	hasPermissions = false
}) {
	const theme = useTheme();
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
	const [deleteId, setDeleteId] = useState(null);
	const navigate = useNavigate();

	const renderCell = (item, column) => {
		console.log(item);
		console.log(column);

		// Handle movie links
		if (column === 'movie' && item.Movie?.title) {
			return (
				<Tooltip title={`${item.Movie.title}${item.Movie.year ? ` (${item.Movie.year})` : ""}`} placement="top">
					<Typography
						onClick={() => navigate(`/movies/${item.Movie.id}`)}
						sx={{
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							cursor: 'pointer',
							color: theme.palette.primary.main,
							'&:hover': {
								textDecoration: 'underline',
								color: theme.palette.primary.dark,
							}
						}}
					>
						{item.Movie.title}
					</Typography>
				</Tooltip>
			);
		}

		if (column === 'Director' && item.Director?.name) {
			return (
				<Typography
					onClick={() => navigate(`/directors/${item.Director?.id}`)}
					sx={{
						whiteSpace: 'nowrap',
						overflow: 'hidden',
						textOverflow: 'ellipsis',
						cursor: 'pointer',
						'&:hover': {
							textDecoration: 'underline',
							color: theme.palette.primary.dark,
						}
					}}
				>
					{item.Director?.name}
				</Typography>)
		}

		if (column === 'name' && item.name) {
			return (
					<Typography
						onClick={() => navigate(`/${resource}/${item.id}`)}
						sx={{
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							cursor: 'pointer',
							'&:hover': {
								textDecoration: 'underline',
								color: theme.palette.primary.dark,
							}
						}}
					>
						{item.name}
					</Typography>
		)}

		const value = item[column];

		// Date format
		if (value && column === "createdAt") {
			const date = new Date(value);
			return date.toLocaleDateString("en-GB", {
				day: "2-digit",
				month: "2-digit",
				year: "2-digit"
			});
		}

		// long text columns
		if (value && ["content", "description", "title"].includes(column)) {
			return (
				<Tooltip title={value} placement="top">
					<Typography
						sx={{
							maxWidth: 300,
							whiteSpace: 'nowrap',
							overflow: 'hidden',
							textOverflow: 'ellipsis'
						}}
					>
						{value}
					</Typography>
				</Tooltip>
			);
		}

		// Rating column
		if (value && column === "rating") {
			return (
				<Box display="flex" alignItems="center">
					<StarIcon sx={{ color: "#FFD700", fontSize: 20 }} />
					<Typography component="span" sx={{ mr: 0.5 }}>{value}</Typography>
				</Box>
			);
		}

		// No value
		if (value === null || value === undefined) return <em>Null</em>;
		return String(value);
	};

	const handleEdit = (event) => {
		const id = event.currentTarget.dataset.index;
		navigate(`/${resource}/edit/${id}`);
	};

	const handleDeleteClick = (event) => {
		setDeleteId(event.currentTarget.dataset.index);
		setDeleteDialogOpen(true);
	};

	const handleDeleteConfirm = () => {
		if (onDelete && deleteId) {
			const fakeEvent = { currentTarget: { dataset: { index: deleteId } } };
			onDelete(fakeEvent);
		}
		setDeleteDialogOpen(false);
		setDeleteId(null);
	};

	const handleDeleteCancel = () => {
		setDeleteDialogOpen(false);
		setDeleteId(null);
	};

	const handleViewDetails = (event) => {
		const id = event.currentTarget.dataset.index;
		navigate(`/${resource}/${id}`);
	};

	return (
		<Paper elevation={3} sx={{ borderRadius: 2, overflow: "hidden" }}>
			<Box sx={{ px: 3, py: 2, bgcolor: theme.palette.primary.main, color: "white" }}>
				<Typography variant="h6">{title}</Typography>
			</Box>
			<TableContainer>
				<Table stickyHeader>
					<TableHead>
						<TableRow>
							{columns.map((column) => (
								<TableCell
									key={column}
									sx={{
										fontWeight: "bold",
										bgcolor: theme.palette.grey[100]
									}}
								>
									{column === 'movie'
										? 'Movie'
										: column.charAt(0).toUpperCase() + column.slice(1)}
								</TableCell>
							))}

							<TableCell
								align="center"
								sx={{
									fontWeight: "bold",
									bgcolor: theme.palette.grey[100],
									minWidth: '110px'
								}}
							>
								Actions
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{data
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((item) => (
								<TableRow key={item.id}>
									{columns.map((column) => (
										<TableCell key={column}>{renderCell(item, column)}</TableCell>
									))}

									<TableCell align="center">

										{["movies", "directors", "users"].includes(resource) && (
											<Tooltip title="View Details">
												<IconButton
													data-index={item.id}
													onClick={handleViewDetails}
													color="secondary"
													size="small"
												>
													<VisibilityIcon />
												</IconButton>
											</Tooltip>
										)}


										{hasPermissions && (
											<>
												<Tooltip title="Edit">
													<IconButton
														data-index={item.id}
														onClick={handleEdit}
														color="primary"
														size="small"
													>
														<EditIcon />
													</IconButton>
												</Tooltip>
												{onDelete && (
													<Tooltip title="Delete">
														<IconButton
															data-index={item.id}
															onClick={handleDeleteClick}
															color="secondary"
															size="small"
														>
															<DeleteIcon />
														</IconButton>
													</Tooltip>
												)}
											</>
										)}
									</TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>
			<TablePagination
				component="div"
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={(_, newPage) => setPage(newPage)}
				onRowsPerPageChange={e => {
					setRowsPerPage(parseInt(e.target.value, 10));
					setPage(0);
				}}
				rowsPerPageOptions={[5, 10, 20]}
			/>
			<Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
				<DialogTitle>Confirm Deletion</DialogTitle>
				<DialogContent>
					<Typography>Are you sure you want to delete this resource?</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleDeleteCancel} color="primary">
						Cancel
					</Button>
					<Button onClick={handleDeleteConfirm} color="secondary" variant="contained">
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Paper>
	);
}