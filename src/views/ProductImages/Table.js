import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate ,Link} from "react-router-dom";
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
    DialogActions,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SizeForm from "./SizeForm";

const TableBanner = () => {
    const [products, setProducts] = useState([]);
    const [deleteProductId, setDeleteProductId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [sizeDialogOpen, setSizeDialogOpen] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    const fetchProducts = useCallback(async (productId) => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://51.20.129.52/admin/Bepocart-Product-images/${productId}/`, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            if (Array.isArray(response.data)) {
                setProducts(response.data);
            } else {
                console.error("Invalid data format:", response.data);
                setError("Invalid data format received");
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
    }, [navigate]);

    useEffect(() => {
        const productId = parseInt(id);
        fetchProducts(productId);
    }, [id, fetchProducts]);

    const handleDeleteConfirmation = (id) => {
        setDeleteProductId(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://51.20.129.52/admin/Bepocart-Product-images-delete/${deleteProductId}/`, {
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

    const handleAddSize = (productId) => {
        setSelectedProductId(productId);
        setSizeDialogOpen(true);
    };

    const handleSizeAdded = (newSize) => {
        setProducts((prevProducts) =>
            prevProducts.map((product) =>
                product.id === newSize.productId ? { ...product, sizes: [...product.sizes, newSize] } : product
            )
        );
    };

    if (loading) {
        return <Typography>Loading...</Typography>;
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    return (
        <>
            {products.length === 0 ? (
                <Typography>No products found.</Typography>
            ) : (
                <Table aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Image 1</TableCell>
                            <TableCell>Image 2</TableCell>
                            <TableCell>Image 3</TableCell>
                            <TableCell>Image 4</TableCell>
                            <TableCell>Image 5</TableCell>
                            <TableCell>Size</TableCell>
                            <TableCell>Delete</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>
                                    <Link to={`/size-table/${product.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>

                                        <Box sx={{ maxWidth: "150px" }}>
                                            <Typography variant="h6" noWrap>
                                                {product.color}
                                            </Typography>
                                        </Box>
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link to={`/size-table/${product.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>

                                        <img
                                            src={`${product.image1}`}
                                            alt={product.name}
                                            style={{ maxWidth: "70px", maxHeight: "70px" }}
                                        />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link to={`/size-table/${product.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>

                                        <img
                                            src={`${product.image2}`}
                                            alt={product.name}
                                            style={{ maxWidth: "70px", maxHeight: "70px" }}
                                        />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link to={`/size-table/${product.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>

                                        <img
                                            src={`${product.image3}`}
                                            alt={product.name}
                                            style={{ maxWidth: "70px", maxHeight: "70px" }}
                                        />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link to={`/size-table/${product.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>

                                        <img
                                            src={`${product.image4}`}
                                            alt={product.name}
                                            style={{ maxWidth: "70px", maxHeight: "70px" }}
                                        />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Link to={`/size-table/${product.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>

                                        <img
                                            src={`${product.image5}`}
                                            alt={product.name}
                                            style={{ maxWidth: "70px", maxHeight: "70px" }}
                                        />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() => handleAddSize(product.id)}
                                    >
                                        Add Size
                                    </Button>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={() => handleDeleteConfirmation(product.id)}
                                        startIcon={<DeleteIcon />}
                                    >
                                        Delete
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
                    <Typography variant="body1">Are you sure you want to delete this product?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete}>Cancel</Button>
                    <Button onClick={handleDelete} variant="contained" color="error">
                        Confirm
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Size Form Dialog */}
            <SizeForm
                open={sizeDialogOpen}
                onClose={() => setSizeDialogOpen(false)}
                productId={selectedProductId}
                onSizeAdded={handleSizeAdded}
            />
        </>
    );
};

export default TableBanner;
