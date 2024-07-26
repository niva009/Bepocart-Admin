import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    Card,
    CardContent,
    Divider,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Snackbar,
    Alert,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    OutlinedInput,
    Chip
} from "@mui/material";

const FbDefaultForm = () => {
    const [formData, setFormData] = useState({
        code: "",
        coupon_type: "",
        discount: "",
        start_date: "",  // Initialize with empty string
        end_date: "",    // Initialize with empty string
        status: "",
        max_uses: "",
        used_count: "",
        discount_product: [],
        discount_category: [],
    });

    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState("");
    const [snackbarSeverity, setSnackbarSeverity] = useState("success");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const productResponse = await axios.get("http://127.0.0.1:8000/admin/Bepocart-products/", {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setProducts(productResponse.data.data);

                const categoryResponse = await axios.get("http://127.0.0.1:8000/admin/Bepocart-subcategories/", {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setCategories(categoryResponse.data.data);
            } catch (error) {
                console.error("Error fetching data", error);
                setSnackbarSeverity("error");
                setSnackbarMessage("Failed to fetch products or categories.");
                setOpenSnackbar(true);
            }
        };

        fetchData();
    }, []);

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const token = localStorage.getItem("token");
            const formattedData = {
                ...formData,
                start_date: new Date(formData.start_date).toISOString(), // Convert to ISO string
                end_date: new Date(formData.end_date).toISOString(),     // Convert to ISO string
            };
            const response = await axios.post('http://127.0.0.1:8000/admin/Bepocart-promotion-coupen/', formattedData, {
                headers: {
                    Authorization: `${token}`,
                },
            });
            console.log('Coupon created successfully:', response.data);
            setSnackbarSeverity("success");
            setSnackbarMessage("Coupon created successfully");
            setOpenSnackbar(true);
            setFormData({
                code: "",
                coupon_type: "",
                discount: "",
                start_date: "",  // Reset to empty string after submission
                end_date: "",    // Reset to empty string after submission
                status: "",
                max_uses: "",
                used_count: "",
                discount_product: [],
                discount_category: [],
            });
        } catch (error) {
            console.error('Error creating coupon:', error);
            setSnackbarSeverity("error");
            setSnackbarMessage("Failed to create coupon");
            setOpenSnackbar(true);
        }
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleMultipleChange = (event, field) => {
        const { target: { value } } = event;
        setFormData({
            ...formData,
            [field]: value
        });
    };

    return (
        <div>
            <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>

            <Card variant="outlined" sx={{ p: 0 }}>
                <Box sx={{ padding: "15px 30px" }} display="flex" alignItems="center">
                    <Box flexGrow={1}>
                        <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
                            Coupon Form
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <CardContent sx={{ padding: "30px" }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="code"
                                    label="Code"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.code}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                    <InputLabel id="coupon-type-label">Coupon Type</InputLabel>
                                    <Select
                                        labelId="coupon-type-label"
                                        id="coupon_type"
                                        name="coupon_type"
                                        value={formData.coupon_type}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Coupon Type" />}
                                    >
                                        <MenuItem value="Percentage">Percentage</MenuItem>
                                        <MenuItem value="Fixed Amount">Fixed Amount</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="discount"
                                    label="Discount"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.discount}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="start_date"
                                    label="Start Date"
                                    type="datetime-local"  // Use type datetime-local
                                    variant="outlined"
                                    fullWidth
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300, // 5 min intervals
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="end_date"
                                    label="End Date"
                                    type="datetime-local"  // Use type datetime-local
                                    variant="outlined"
                                    fullWidth
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    inputProps={{
                                        step: 300, // 5 min intervals
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                    <InputLabel id="status-label">Status</InputLabel>
                                    <Select
                                        labelId="status-label"
                                        id="status"
                                        name="status"
                                        value={formData.status}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Status" />}
                                    >
                                        <MenuItem value="Active">Active</MenuItem>
                                        <MenuItem value="Inactive">Inactive</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="max_uses"
                                    label="Max Uses"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.max_uses}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="used_count"
                                    label="Used Count"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.used_count}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                    type="number" // Ensure input is of type number
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                    <InputLabel id="discount-product-label">Discount Product</InputLabel>
                                    <Select
                                        labelId="discount-product-label"
                                        id="discount_product"
                                        multiple
                                        value={formData.discount_product}
                                        onChange={(e) => handleMultipleChange(e, "discount_product")}
                                        input={<OutlinedInput label="Discount Product" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={products.find(p => p.id === value)?.name || value} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {products.map((product) => (
                                            <MenuItem key={product.id} value={product.id}>
                                                {product.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                    <InputLabel id="discount-category-label">Discount Category</InputLabel>
                                    <Select
                                        labelId="discount-category-label"
                                        id="discount_category"
                                        multiple
                                        value={formData.discount_category}
                                        onChange={(e) => handleMultipleChange(e, "discount_category")}
                                        input={<OutlinedInput label="Discount Category" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={categories.find(c => c.id === value)?.name || value} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <Button variant="contained" color="primary" type="submit" fullWidth>
                                    Create Coupon
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default FbDefaultForm;
