import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams} from 'react-router-dom';

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
    const [editedProductStock, setEditedProductStock] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();  // Access the id parameter from the URL

    useEffect(() => {
        fetchProducts(id);  // Pass the id to fetchProducts
    }, [id]);

    const fetchProducts = async (id) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get(`http://127.0.0.1:8000/admin/Bepocart-product-varient-view/${id}/`, {
                headers: {
                    'Authorization': `${token}`
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
                setError("Error fetching banners");
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
            await axios.delete(`http://127.0.0.1:8000/admin/Bepocart-product-varient-delete/${deleteProductId}/`);
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

    const handleUpdate = (id, name, stock) => {
        setEditProductId(id);
        setEditedProductName(name);
        setEditedProductStock(stock);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditProductId(null);
        setEditDialogOpen(false);
    };

    const handleSaveEdit = async () => {
        try {
            await axios.put(`http://127.0.0.1:8000/admin/Bepocart-product-varient-update/${editProductId}/`, {
                name: editedProductName,
                stock: editedProductStock,
                // Add other fields you want to update
            });
            // Update product locally
            const updatedProducts = products.map(product =>
                product.id === editProductId ? { ...product, name: editedProductName, stock: editedProductStock } : product
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
                    {/* Table Header */}
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Product</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Stock</TableCell>
                            <TableCell>Delete</TableCell>
                            <TableCell>Update</TableCell>
                        </TableRow>
                    </TableHead>
                    {/* Table Body */}
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>
                                    {/* <Link to={`/size-table/${product.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}> */}

                                        <img
                                            src={`http://127.0.0.1:8000/${product.productImage}`}
                                            alt={product.name}
                                            style={{ maxWidth: "70px", maxHeight: "70px" }}
                                        />
                                    {/* </Link> */}
                                </TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="h6">{product.size}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box>
                                        <Typography variant="h6">{product.stock}</Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" color="error" onClick={() => handleDeleteConfirmation(product.id)}>
                                        <DeleteIcon/> Delete
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button variant="contained" onClick={() => handleUpdate(product.id, product.size, product.stock)}>
                                        <EditIcon/> Update
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}

            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onClose={handleCancelDelete}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography variant="body1">Are you sure you want to delete this Size?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="error">Confirm</Button>
                </DialogActions>
            </Dialog>

            {/* Edit Product Dialog */}
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
                    <TextField
                        label="Product Stock"
                        type="number"
                        value={editedProductStock}
                        onChange={(e) => setEditedProductStock(e.target.value)}
                        fullWidth
                        margin="normal"
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
