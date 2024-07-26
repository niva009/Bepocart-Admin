import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    CircularProgress,
} from "@mui/material";
// import PermMediaIcon from '@mui/icons-material/PermMedia';

const TableBanner = () => {
    const [products, setProducts] = useState([]);
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
            const response = await axios.get("http://127.0.0.1:8000/admin/Bepocart-customers/", {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            console.log(response.data.data)
            if (Array.isArray(response.data.data)) {
                setProducts(response.data.data);
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
                            <TableCell>Id</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Image</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Phone</TableCell>
                            <TableCell>Place</TableCell>
                            <TableCell>PinCode</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>
                                    <Box sx={{ maxWidth: "150px" }}>
                                        <Link to={`/user-coin-data/${product.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                            <Typography variant="h6" noWrap>
                                                {product.first_name} {product.last_name}
                                            </Typography>
                                        </Link>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Link to={`/user-coin-data/${product.id}/`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                        <img
                                            src={`http://127.0.0.1:8000/${product.image}`}
                                            alt={product.name}
                                            style={{ maxWidth: "70px", maxHeight: "70px" }}
                                        />
                                    </Link>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ maxWidth: "150px" }}>
                                        <Typography variant="h6" noWrap>
                                            {product.email}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ maxWidth: "150px" }}>
                                        <Typography variant="h6" noWrap>
                                            {product.phone}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ maxWidth: "150px" }}>
                                        <Typography variant="h6" noWrap>
                                            {product.place}
                                        </Typography>
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Box sx={{ maxWidth: "150px" }}>
                                        <Typography variant="h6" noWrap>
                                            {product.zip_code}
                                        </Typography>
                                    </Box>
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
