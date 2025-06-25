import React, { useState, useEffect } from "react";
import { Box, Button, Container, Typography, Alert } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ResourceTable from "../../components/ResourceTable/ResourceTable";
import { getDirectors, deleteDirector } from "../../api/directors";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function DirectorsPage() {
    const navigate = useNavigate();
    const [directors, setDirectors] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    
    const isAdmin = user && user.role === "admin";  // Check if user is admin

    useEffect(() => {
        getDirectors()
            .then((response) => {
                setDirectors(response.data);
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching directors:", error);
                setError("Failed to load directors.");
            });
    }, []);

    function deleteDirectorHandler(event) {
        const deletedId = event.currentTarget.dataset.index;
        deleteDirector(deletedId)
            .then(() => {
                setDirectors((prev) => prev.filter(
                    (director) => String(director.id) !== String(deletedId)
                ));
            })
            .catch(error => {
                console.error("Error deleting director:", error);
                setError("Failed to delete director.");
            });
    }

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Directors
                </Typography>
                {isAdmin && (  // Only show create button for admins
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<AddIcon />}
                        onClick={() => navigate("/directors/create")}
                    >
                        Create Director
                    </Button>
                )}
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <ResourceTable
                data={directors}
                columns={["id", "name", "createdAt"]}
                onDelete={deleteDirectorHandler}
                title="Directors"
                resource="directors"
                hasPermissions={isAdmin}
            />
        </Container>
    );
}