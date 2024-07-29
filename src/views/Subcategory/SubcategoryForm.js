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
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

const FbDefaultForm = () => {
    const [state, setState] = useState({
        name: "",
        slug: "",
        file: null,
        mainCategory: "",
        selectedCategoryImage: null,
    });

    const [mainCategories, setMainCategories] = useState([]);
    const [message, setMessage] = useState(null);
    const [severity, setSeverity] = useState("success");
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMainCategories();
    }, []);

    const fetchMainCategories = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get("http://127.0.0.1:8000/admin/Bepocart-main-categories/", {
                headers: {
                    'Authorization': `${token}`,
                },
            });
    
            if (Array.isArray(response.data)) {
                setMainCategories(response.data);
            } else {
                console.error("Invalid data format:", response.data);
            }
        } catch (error) {
            console.error("Error fetching main categories:", error);
        } finally {
            setLoading(false);
        }
    };
    

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "category") {
            const selectedCategory = mainCategories.find(category => category.id === value);
            setState({
                ...state,
                mainCategory: value,
                selectedCategoryImage: selectedCategory ? `http://127.0.0.1:8000/${selectedCategory.image}` : null,
            });
        } else {
            setState({
                ...state,
                [name]: files ? files[0] : value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", state.name);
        formData.append("slug", state.slug);
        formData.append("category", state.mainCategory);
        if (state.file) {
            formData.append("image", state.file);
        }

        try {
            const response = await axios.post("http://127.0.0.1:8000/admin/Bepocart-subcategory/", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage("Form submitted successfully!");
            setSeverity("success");
            setOpen(true);
            console.log("Success", response.data);
            setState({
                name: "",
                slug: "",
                file: null,
                mainCategory: "",
                selectedCategoryImage: null,
            });
        } catch (error) {
            setMessage("Failed to submit the form.");
            setSeverity("error");
            setOpen(true);
            console.error("Error", error.response ? error.response.data : error.message);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }}>
                    {message}
                </Alert>
            </Snackbar>

            <Card variant="outlined" sx={{ p: 0 }}>
                <Box sx={{ padding: "15px 30px" }} display="flex" alignItems="center">
                    <Box flexGrow={1}>
                        <Typography sx={{ fontSize: "18px", fontWeight: "500" }}>
                            Sub Category Form
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <CardContent sx={{ padding: "30px" }}>
                    {loading ? (
                        <Typography>Loading...</Typography>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <TextField
                                name="name"
                                label="Name"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                value={state.name}
                                onChange={handleChange}
                            />
                            <TextField
                                name="slug"
                                label="Slug"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                value={state.slug}
                                onChange={handleChange}
                            />
                            <TextField
                                name="image"
                                type="file"
                                variant="outlined"
                                fullWidth
                                sx={{ mb: 2 }}
                                onChange={(e) => setState({ ...state, file: e.target.files[0] })}
                            />
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="category"
                                    value={state.mainCategory}
                                    onChange={handleChange}
                                >
                                    {mainCategories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                            {state.selectedCategoryImage && (
                                <Box
                                    component="img"
                                    src={state.selectedCategoryImage}
                                    alt="Selected Category"
                                    sx={{
                                        maxWidth: "100%",
                                        maxHeight: "200px",
                                        mb: 2,
                                        borderRadius: "8px",
                                        boxShadow: 1,
                                    }}
                                />
                            )}
                            <Button type="submit" color="primary" variant="contained">
                                Submit
                            </Button>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default FbDefaultForm;
