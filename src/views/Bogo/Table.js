import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    CircularProgress,
    DialogActions,
    Switch,
    FormControlLabel
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const BlogTable = () => {
    const [products, setProducts] = useState([]);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://127.0.0.1:8000/admin/offer/", {
                headers: {
                    'Authorization': `${token}`,
                },
            });

            if (Array.isArray(response.data.data)) {
                setProducts(response.data.data);
            } else {
                setError("Invalid data format received");
            }
        } catch (error) {
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                navigate('/login');
            } else {
                setError("Error fetching products");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirmation = (id) => {
        setDeleteProductId(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://127.0.0.1:8000/admin/Bepocart-offer-delete/${deleteProductId}/`, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            setProducts(products.filter(product => product.id !== deleteProductId));
            setDeleteDialogOpen(false);
        } catch (error) {
            setError("Error deleting product");
        }
    };

    const handleCancelDelete = () => {
        setDeleteProductId(null);
        setDeleteDialogOpen(false);
    };

    const handleStatusToggle = async (productId, currentStatus) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://127.0.0.1:8000/admin/Bepocart-offer/${productId}/toggle-status/`, {}, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
    
            if (response.status === 200) {
                setProducts(products.map(product => 
                    product.id === productId ? { ...product, offer_active: response.data.offer_active } : product
                ));
            }
        } catch (error) {
            console.error("Error updating product status:", error);
        }
    };
    

    return (
        <>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography variant="body1" color="error">{error}</Typography>
            ) : (
                <Table
                    aria-label="simple table"
                    sx={{
                        mt: 3,
                        whiteSpace: "nowrap",
                    }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>TITLE</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>OFFER TYPE</TableCell>
                            <TableCell>STATUS</TableCell>
                            <TableCell>ACTIONS</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="h6">{product.name}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <img
                                        src={`http://127.0.0.1:8000/${product.image}`}
                                        alt={product.name}
                                        style={{ maxWidth: "70px", maxHeight: "70px" }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="h6">{product.offer_type} {product.get_option} GET {product.get_value} {product.method}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <FormControlLabel
                                        control={
                                            <Switch
                                                checked={product.offer_active}
                                                onChange={() => handleStatusToggle(product.id, product.offer_active)}
                                                color="primary"
                                            />
                                        }
                                        label={product.offer_active ? "ON" : "OFF"}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" onClick={() => handleDeleteConfirmation(product.id)}>
                                        <DeleteIcon /> Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to delete this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="error">Confirm</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default BlogTable;
