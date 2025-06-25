import React, { useState, useEffect } from "react";
import { Box, Container, Typography, Alert } from "@mui/material";
import ResourceTable from "../../components/ResourceTable/ResourceTable";
import { getUsers, deleteUser } from "../../api/users";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function UsersPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const isAdmin = user && user.role === "admin";

    useEffect(() => {
        if (!isAdmin) {
            navigate("/");
            return;
        }

        getUsers()
            .then((response) => {
                setUsers(response.data);
                setError(null);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setError("Failed to load users.");
            });
    }, [isAdmin, navigate]);

    const deleteUserHandler = (event) => {
        const deletedId = event.currentTarget.dataset.index;
        
        deleteUser(deletedId)
             .then(() => {
             setUsers((prev) => prev.filter((user) => String(user.id) !== String(deletedId)));
         })
             .catch(error => {
                console.error("Error deleting user:", error);
                 setError("Failed to delete user.");
             });
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h4" component="h1">
                    Users
                </Typography>

            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <ResourceTable
                data={users}
                columns={["id", "name", "email", "role", "createdAt"]}
                onDelete={deleteUserHandler}
                title="Users"
                resource="users"
                hasPermissions={isAdmin}
            />
        </Container>
    );
}