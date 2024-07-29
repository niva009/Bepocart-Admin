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
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const CategoryTable = () => {
    const [products, setProducts] = useState([]);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editProductId, setEditProductId] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedProductName, setEditedProductName] = useState("");
    const [editedProductImage, setEditedProductImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            console.log("token", token);
            const response = await axios.get("http://127.0.0.1:8000/admin/Bepocart-categories/", {
                headers: {
                    'Authorization': `${token}`,
                },
            });
    
            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                console.error("Invalid data format:", response.data);
                setError("Invalid data format");
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                navigate('/login');
            } else {
                setError("Error fetching products");
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
            if (!token) {
                console.error("User is not authenticated");
                return;
            }
    
            await axios.delete(`http://127.0.0.1:8000/admin/Bepocart-category-delete/${deleteProductId}/`, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
    
            setProducts(products.filter(product => product.id !== deleteProductId));
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const handleCancelDelete = () => {
        setDeleteProductId(null);
        setDeleteDialogOpen(false);
    };

    const handleUpdate = (id, name, image) => {
        setEditProductId(id);
        setEditedProductName(name);
        setEditedProductImage(null); // Reset the image input
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditProductId(null);
        setEditDialogOpen(false);
    };

    const handleSaveEdit = async () => {
        try {
            const formData = new FormData();
            formData.append('name', editedProductName);
            if (editedProductImage) {
                formData.append('image', editedProductImage);
            }

            const token = localStorage.getItem('token');
            await axios.put(`http://127.0.0.1:8000/admin/Bepocart-category-update/${editProductId}/`, formData, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            });

            const updatedProducts = products.map(product =>
                product.id === editProductId ? { ...product, name: editedProductName, image: editedProductImage ? URL.createObjectURL(editedProductImage) : product.image } : product
            );
            setProducts(updatedProducts);
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating product:", error);
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
                                        src={`http://127.0.0.1:8000/${product.image}`}
                                        alt={product.name}
                                        style={{ maxWidth: "50px", maxHeight: "50px" }}
                                    />
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" onClick={() => handleDeleteConfirmation(product.id)}>
                                        <DeleteIcon/> 
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={() => handleUpdate(product.id, product.name, product.image)}>
                                        <EditIcon/> 
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
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setEditedProductImage(e.target.files[0])}
                        style={{ marginTop: '20px' }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose}>Cancel</Button>
                    <Button onClick={handleSaveEdit} variant="contained" color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CategoryTable;
