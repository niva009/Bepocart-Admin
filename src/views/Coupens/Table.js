import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { Link, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Button,
    Chip,
} from "@mui/material";
import { green } from "@mui/material/colors";
import PermMediaIcon from '@mui/icons-material/PermMedia';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const TableBanner = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchProducts = useCallback(async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get("http://51.20.129.52/admin/Bepocart-promotion-coupen-views/", {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            setProducts(response.data);
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

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://51.20.129.52/admin/Bepocart-promotion-coupen-delete/${id}/`, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            fetchProducts();
        } catch (error) {
            console.error("Error deleting coupon:", error);
            setError("Error deleting coupon");
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <Table aria-label="simple table" sx={{ mt: 3, whiteSpace: "nowrap" }}>
                <TableHead>
                    <TableRow>
                        <TableCell>ID</TableCell>
                        <TableCell>COUPEN</TableCell>
                        <TableCell>TYPE</TableCell>
                        <TableCell>DISCOUNT</TableCell>
                        <TableCell>START DATE</TableCell>
                        <TableCell>END DATE</TableCell>
                        <TableCell>STATUS</TableCell>
                        <TableCell>PRODUCTS</TableCell>
                        <TableCell>CATEGORY</TableCell>
                        <TableCell>ACTIONS</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {products.map((product) => (
                        <TableRow key={product.id}>
                            <TableCell>{product.id}</TableCell>
                            <TableCell>
                                <Box sx={{ maxWidth: "150px" }}>
                                    <Link to={`/product-image-form/${product.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <Typography variant="body1" noWrap>
                                            {product.code}
                                        </Typography>
                                    </Link>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ maxWidth: "150px" }}>
                                    <Typography variant="body1" noWrap>
                                        {product.coupon_type}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ maxWidth: "150px" }}>
                                    <Typography variant="body1" noWrap>
                                        {product.discount}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ maxWidth: "150px" }}>
                                    <Typography variant="body1" noWrap>
                                        {product.start_date}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ maxWidth: "150px" }}>
                                    <Typography variant="body1" noWrap>
                                        {product.end_date}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Chip
                                    sx={{
                                        pl: "4px",
                                        pr: "4px",
                                        backgroundColor: product.status === "In Active" ? "red" : (product.status === "Active" ? green[500] : product.pbg),
                                        color: "#fff",
                                    }}
                                    size="small"
                                    label={product.status}
                                />
                            </TableCell>
                            <TableCell>
                                <Box sx={{ maxWidth: "150px" }}>
                                    <Typography variant="body1" noWrap>
                                        {product.discount_product ? product.discount_product : "No products"}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Box sx={{ maxWidth: "150px" }}>
                                    <Typography variant="body1" noWrap>
                                        {product.discount_category}
                                    </Typography>
                                </Box>
                            </TableCell>
                            <TableCell>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    component={Link}
                                    to={`/update-coupon/${product.id}/`}
                                    sx={{ mr: 1 }}
                                    startIcon={<PermMediaIcon />}
                                >
                                    Update
                                </Button>
                                <Button
                                    variant="contained"
                                    color="error"
                                    onClick={() => handleDelete(product.id)}
                                    startIcon={<LocalOfferIcon />}
                                >
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};

export default TableBanner;
