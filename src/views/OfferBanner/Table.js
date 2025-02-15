import React, { useEffect, useState, useCallback } from "react";
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
    TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const TableBanner = () => {
    const [products, setProducts] = useState([]);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedProductName, setEditedProductName] = useState("");
    const [editedProductImage, setEditedProductImage] = useState(null);
    const [editedProductImagePreview, setEditedProductImagePreview] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://51.20.129.52/admin/Bepocart-Offer-Banners/", {
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
                setError("Error fetching banners");
            }
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const handleDeleteConfirmation = (id) => {
        setDeleteProductId(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://51.20.129.52/admin/Bepocart-Offer-Banner-Delete/${deleteProductId}/`, {
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

    const handleUpdate = (id, name, image) => {
        setEditProductId(id);
        setEditedProductName(name);
        setEditedProductImage(null);
        setEditedProductImagePreview(`${image}`);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditProductId(null);
        setEditDialogOpen(false);
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            const formData = new FormData();
            formData.append("name", editedProductName);
            if (editedProductImage) {
                formData.append("image", editedProductImage);
            }

            const response = await axios.put(`http://51.20.129.52/admin/Bepocart-Banner-update/${editProductId}/`, formData, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const updatedProduct = response.data;
            const updatedProducts = products.map(product =>
                product.id === editProductId ? updatedProduct : product
            );
            setProducts(updatedProducts);
            setEditDialogOpen(false);
        } catch (error) {
            setError("Error updating product");
        }
    };

    if (loading) return <CircularProgress />;
    if (error) return <div>{error}</div>;

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
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Delete</TableCell>
                            <TableCell>Update</TableCell>
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
                                        src={`${product.image}`}
                                        alt={product.name}
                                        style={{ maxWidth: "70px", maxHeight: "70px" }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" onClick={() => handleDeleteConfirmation(product.id)}>
                                        <DeleteIcon /> Delete
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={() => handleUpdate(product.id, product.name, product.image)}>
                                        <EditIcon /> Update
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

            <Dialog open={editDialogOpen} onClose={handleEditDialogClose}>
                <DialogTitle>Edit Product</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Product Name"
                        value={editedProductName}
                        onChange={(e) => setEditedProductName(e.target.value)}
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        component="label"
                        sx={{ mt: 2 }}
                    >
                        Upload Image
                        <input
                            type="file"
                            hidden
                            onChange={(e) => {
                                setEditedProductImage(e.target.files[0]);
                                setEditedProductImagePreview(URL.createObjectURL(e.target.files[0]));
                            }}
                        />
                    </Button>
                    {editedProductImagePreview && (
                        <Box sx={{ mt: 2 }}>
                            <Typography variant="body2">Selected Image:</Typography>
                            <img
                                src={editedProductImagePreview}
                                alt="Selected"
                                style={{ maxWidth: "200px", maxHeight: "200px" }}
                            />
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TableBanner;
