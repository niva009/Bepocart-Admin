import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import {
    Card,
    CardContent,
    Divider,
    Box,
    Typography,
    TextField,
    Button,
    Grid,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    OutlinedInput,
    Chip,
} from "@mui/material";

const FbDefaultForm = () => {
    const { id } = useParams(); // Fetching id from URL params
    const [formData, setFormData] = useState({
        code: "",
        coupon_type: "Percentage",
        discount: "",
        start_date: "",
        end_date: "",
        status: "Active",
        max_uses: "",
        used_count: 0,
        discount_product: [],
        discount_category: [],
    });
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);

    const fetchCouponDetails = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://51.20.129.52/admin/Bepocart-promotion-coupen-update/${id}/`, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            const couponData = response.data.data;
            console.log("Coupon Data:", couponData);
    
            // Ensure couponData exists and has necessary fields
            if (couponData) {
                setFormData({
                    code: couponData.code || "",
                    coupon_type: couponData.coupon_type || "Percentage",
                    discount: couponData.discount || "",
                    start_date: couponData.start_date || "",
                    end_date: couponData.end_date || "",
                    status: couponData.status || "Active",
                    max_uses: couponData.max_uses || "",
                    used_count: couponData.used_count || 0,
                    discount_product: couponData.discount_product ? couponData.discount_product.map(p => p.id) : [],
                    discount_category: couponData.discount_category ? couponData.discount_category.map(c => c.id) : [],
                });
            } else {
                console.error("Empty or undefined coupon data received.");
                // Handle empty or undefined data scenario
            }
        } catch (error) {
            console.error("Error fetching coupon details:", error);
            // Handle error
        }
    }, [id]);

    const fetchProducts = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://51.20.129.52/admin/Bepocart-products/", {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            setProducts(response.data.data);
        } catch (error) {
            console.error("Error fetching products:", error);
            // Handle error
        }
    }, []);

    const fetchCategories = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://51.20.129.52/admin/Bepocart-subcategories/", {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            setCategories(response.data.data);
        } catch (error) {
            console.error("Error fetching categories:", error);
            // Handle error
        }
    }, []);

    useEffect(() => {
        if (id) {
            fetchCouponDetails();
        }
        fetchProducts();
        fetchCategories();
    }, [id, fetchCouponDetails, fetchProducts, fetchCategories]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleMultipleChange = (e, name) => {
        const { value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://51.20.129.52/admin/Bepocart-promotion-coupen-update/${id}/`, formData, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            console.log('Coupon updated successfully:', formData);
        } catch (error) {
            console.error("Error updating coupon:", error);
            // Show error message
        }
        console.log("Product   :", formData.discount_product);
        console.log("Category  :", formData.discount_category);
    };

    return (
        <div>
            <Card variant="outlined" sx={{ p: 0 }}>
                <Box sx={{ padding: "15px 30px" }} display="flex" alignItems="center">
                    <Box flexGrow={1}>
                        <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
                            Update Coupon
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
                                    type="datetime-local"
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
                                    type="datetime-local"
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
                                    type="number"
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
                                    Update Coupon
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
