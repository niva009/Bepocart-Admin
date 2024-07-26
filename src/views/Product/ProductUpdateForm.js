import React, { useState, useEffect } from "react";
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
    Alert,
    Snackbar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
} from "@mui/material";

const FbDefaultForm = () => {
    const { id } = useParams();

    const [state, setState] = useState({
        name: "",
        file: null,
        slug: "",
        category: "",
        discount: "",
        salePrice: "",
        price: "",
        description: "",
        shortDescription: "",
    });

    const [categories, setCategories] = useState([]);
    const [message, setMessage] = useState(null);
    const [severity, setSeverity] = useState("success");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://127.0.0.1:8000/admin/Bepocart-subcategories/", {
                    headers: {
                        Authorization: `${token}`,
                    },
                });
                setCategories(response.data.data);
            } catch (error) {
                handleApiError("Failed to fetch categories.", error);
            }
        };

        const fetchProductDetails = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get(`http://127.0.0.1:8000/admin/Bepocart-product-update/${id}/`, {
                    headers: {
                        Authorization: `${token}`,
                    },
                });

                const productData = response.data.data;

                setState({
                    name: productData.name,
                    slug: productData.slug,
                    category: productData.category,
                    salePrice: productData.salePrice,
                    price: productData.price,
                    discount: productData.discount,
                    description: productData.description,
                    shortDescription: productData.short_description,
                });
            } catch (error) {
                console.error("Error fetching product details", error);
            }
        };

        fetchCategories();
        if (id) {
            fetchProductDetails();
        }
    }, [id]);

    const calculateDiscount = (price, salePrice) => {
        const priceFloat = parseFloat(price);
        const salePriceFloat = parseFloat(salePrice);
    
        if (!isNaN(priceFloat) && !isNaN(salePriceFloat) && priceFloat > 0) {
            const discount = ((priceFloat - salePriceFloat) / priceFloat) * 100;
            return discount.toFixed(2); // returns discount as a percentage with 2 decimal places
        }
        return "";
    };
    
    const handleChange = (e) => {
        const { name, value, files } = e.target;

        let newState = {
            ...state,
            [name]: files ? files[0] : value,
        };

        if (name === "slug") {
            const lowerCaseSlug = value.toLowerCase();
            newState = {
                ...newState,
                slug: lowerCaseSlug,
            };
        }

        if (name === "price" || name === "salePrice") {
            const discount = calculateDiscount(newState.price, newState.salePrice);
            newState = {
                ...newState,
                discount,
            };
        }

        if (name === "shortDescription" && value.length > 255) {
            handleValidationMessage("Short description cannot exceed 255 characters.");
            return;
        }

        setState(newState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const formData = new FormData();
            formData.append("name", state.name);
            if (state.file) {
                formData.append("image", state.file);
            }
            formData.append("slug", state.slug);
            formData.append("category", state.category);
            formData.append("price", state.price);
            formData.append("salePrice", state.salePrice);
            formData.append("discount", state.discount);
            formData.append("description", state.description);
            formData.append("short_description", state.shortDescription);

            const token = localStorage.getItem("token");
            let response;
            if (id) {
                response = await axios.put(`http://127.0.0.1:8000/admin/Bepocart-product-update/${id}/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `${token}`,
                    },
                });
            } else {
                response = await axios.post("http://127.0.0.1:8000/admin/Bepocart-product/", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `${token}`,
                    },
                });
            }

            handleSuccessMessage("Form submitted successfully!");
            setState({
                name: "",
                file: null,
                slug: "",
                category: "",
                discount: "",
                salePrice: "",
                price: "",
                description: "",
                shortDescription: "",
            });
        } catch (error) {
            handleApiError("Failed to submit the form.", error);
        }
    };

    const handleApiError = (message, error) => {
        setSeverity("error");
        setMessage(message);
        setOpen(true);
        console.error("API Error:", error.response ? error.response.data : error.message);
    };

    const handleValidationMessage = (message) => {
        setSeverity("error");
        setMessage(message);
        setOpen(true);
    };

    const handleSuccessMessage = (message) => {
        setSeverity("success");
        setMessage(message);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: "100%" }}>
                    {message}
                </Alert>
            </Snackbar>

            <Card variant="outlined" sx={{ p: 0 }}>
                <Box sx={{ padding: "15px 30px" }} display="flex" alignItems="center">
                    <Box flexGrow={1}>
                        <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
                            Offer Product Form
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <CardContent sx={{ padding: "30px" }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="name"
                                    label="Name"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    value={state.name}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="image"
                                    type="file"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    onChange={(e) => setState({ ...state, file: e.target.files[0] })}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="slug"
                                    label="Slug"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    value={state.slug}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                    <InputLabel>Category</InputLabel>
                                    <Select
                                        name="category"
                                        value={state.category}
                                        onChange={handleChange}
                                        label="Category"
                                    >
                                        {categories.map((category) => (
                                            <MenuItem key={category.id} value={category.id}>
                                                {category.name}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="price"
                                    label="Price"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    value={state.price}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="salePrice"
                                    label="Sale Price"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    value={state.salePrice}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="discount"
                                    label="Discount"
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 2 }}
                                    value={state.discount}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="description"
                                    label="Description"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={4}
                                    sx={{ mb: 2 }}
                                    value={state.description}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="shortDescription"
                                    label="Short Description"
                                    variant="outlined"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    sx={{ mb: 2 }}
                                    value={state.shortDescription}
                                    onChange={handleChange}
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" color="primary" variant="contained" sx={{ mt: 2 }}>
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default FbDefaultForm;
