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
    Checkbox,
    FormControlLabel,
} from "@mui/material";

const FbDefaultForm = () => {
    const [state, setState] = useState({
        image1: null,
        image2: null,
        image3: null,
        image4: null,
        image5: null,
        sizes: [],
        color: "",
    });

    const { id } = useParams();
    const [message, setMessage] = useState(null);
    const [severity, setSeverity] = useState("success");
    const [open, setOpen] = useState(false);
    const [features, setFeatures] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get("http://51.20.129.52/admin/Bepocart-product-size-view/");
                setFeatures(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setState({
            ...state,
            [name]: files ? files[0] : value,
        });
    };

    const handleSizeChange = (e) => {
        const { name, checked } = e.target;
        const sizeId = parseInt(name);
        if (checked) {
            setState({
                ...state,
                sizes: [...state.sizes, sizeId],
            });
        } else {
            setState({
                ...state,
                sizes: state.sizes.filter((size) => size !== sizeId),
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("color", state.color);
        formData.append("image1", state.image1);
        formData.append("image2", state.image2);
        formData.append("image3", state.image3);
        formData.append("image4", state.image4);
        formData.append("image5", state.image5);
        state.sizes.forEach((size) => formData.append("size", size));

        try {
            const response = await axios.post(`http://51.20.129.52/admin/Bepocart-Product-image-add/${id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage("Form submitted successfully!");
            setSeverity("success");
            setOpen(true);
            console.log("Success", response.data);
            setState({
                image1: null,
                image2: null,
                image3: null,
                image4: null,
                image5: null,
                sizes: [],
                color: "",
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
                            Product Form
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <CardContent sx={{ padding: "30px" }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="color"
                            label="Color / Teeth /  Enthenkilum okke onn kodukkadeeeeee"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.color}
                            onChange={handleChange}
                        />
                        <TextField
                            name="image1"
                            variant="outlined"
                            type="file"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={handleChange}
                        />
                        <TextField
                            name="image2"
                            variant="outlined"
                            type="file"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={handleChange}
                        />
                        <TextField
                            name="image3"
                            variant="outlined"
                            type="file"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={handleChange}
                        />
                        <TextField
                            name="image4"
                            variant="outlined"
                            type="file"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={handleChange}
                        />
                        <TextField
                            name="image5"
                            variant="outlined"
                            type="file"
                            fullWidth
                            sx={{ mb: 2 }}
                            onChange={handleChange}
                        />

                        <Typography variant="h6" gutterBottom>
                            Sizes:
                        </Typography>
                        <Grid container spacing={2}>
                            {features.map((size) => (
                                <Grid item xs={6} sm={4} key={size.id}>
                                    <FormControlLabel
                                        control={
                                            <Checkbox
                                                checked={state.sizes.includes(size.id)}
                                                onChange={handleSizeChange}
                                                name={size.id.toString()}
                                            />
                                        }
                                        label={size.name}
                                    />
                                </Grid>
                            ))}
                        </Grid>

                        <Button type="submit" color="primary" variant="contained">
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default FbDefaultForm;
