import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
    Rating,
    Button,
} from "@mui/material";

const TableBanner = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://51.20.129.52/admin/Bepocart-Product-Review/", {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            console.log(response.data.data);
            if (Array.isArray(response.data.data)) {
                setProducts(response.data.data);
            } else {
                console.error("Invalid data format:", response.data.data);
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
        fetchProducts();
    }, [fetchProducts]);

    const handleApprove = async (id) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.put(`http://51.20.129.52/admin/Bepocart-approve-review/${id}/`, null, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            if (response.status === 200) {
                setProducts(products.map(product => 
                    product.id === id ? { ...product, status: 'Approved' } : product
                ));
            }
        } catch (error) {
            console.error("Error updating status:", error);
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
                <Table aria-label="simple table" sx={{ mt: 3, whiteSpace: "nowrap" }}>
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Id</TableCell>
                            <TableCell align="center">NAME</TableCell>
                            <TableCell align="center">IMAGE</TableCell>
                            <TableCell align="center">PRODUCT IMAGE</TableCell>
                            <TableCell align="center">STAR</TableCell>
                            <TableCell align="center">REVIEW</TableCell>
                            <TableCell align="center">STATUS</TableCell>
                            <TableCell align="center">ACTION</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell align="center">{product.id}</TableCell>
                                <TableCell align="center">
                                    <Box sx={{ maxWidth: "150px" }}>
                                        <Link to={`/user-coin-data/${product.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Typography variant="h6" noWrap>
                                                {product.first_name} {product.last_name}
                                            </Typography>
                                        </Link>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Link to={`/user-coin-data/${product.user}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <img
                                            src={`${product.image}`}
                                            alt={product.user}
                                            style={{ maxWidth: "70px", maxHeight: "70px" }}
                                        />
                                    </Link>
                                </TableCell>
                                <TableCell align="center">
                                    <Link to={`/user-coin-data/${product.product}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <img
                                            src={`${product.product_image}`}
                                            alt={product.product}
                                            style={{ maxWidth: "70px", maxHeight: "70px" }}
                                        />
                                    </Link>
                                </TableCell>
                                <TableCell align="center">
                                    <Rating value={product.rating} readOnly />
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ maxWidth: "150px" }}>
                                        <Typography variant="h6" noWrap>
                                            {product.review_text}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    <Box sx={{ maxWidth: "150px" }}>
                                        <Typography 
                                            variant="h6" 
                                            noWrap 
                                            sx={{ 
                                                color: product.status === 'Approved' ? 'green' : 'red'
                                            }}
                                        >
                                            {product.status}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell align="center">
                                    {product.status !== 'Approved' && (
                                        <Button 
                                            variant="contained" 
                                            color="primary" 
                                            onClick={() => handleApprove(product.id)}
                                        >
                                            Approve
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </>
    );
};

export default TableBanner;
