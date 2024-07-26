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
    Alert,
    Snackbar,
} from "@mui/material";

const FbDefaultForm = () => {
    const { id } = useParams(); // Assuming you're using React Router for routing
    const [state, setState] = useState({
        title: "",
        file: null,
        content: "",
    });

    const [message, setMessage] = useState(null);
    const [severity, setSeverity] = useState("success");
    const [open, setOpen] = useState(false);
    const [updateMode, setUpdateMode] = useState(false);

    const fetchBlogData = useCallback(async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://127.0.0.1:8000/admin/Bepocart-Blog-update/${id}/`, {
                headers: {
                    'Authorization': `${token}`,
                },
            });
            const { title, content } = response.data.data;
            setState({
                ...state,
                title,
                content,
            });
        } catch (error) {
            console.error("Error fetching blog data:", error);
            setMessage("Failed to fetch blog data.");
            setSeverity("error");
            setOpen(true);
        }
    }, [id, state]);

    useEffect(() => {
        if (id) {
            fetchBlogData();
            setUpdateMode(true);
        }
    }, [id, fetchBlogData]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        setState({
            ...state,
            [name]: name === 'file' ? files[0] : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("title", state.title);
        if (state.file) {
            formData.append("image", state.file);
        }
        formData.append("content", state.content);

        try {
            const token = localStorage.getItem('token');
            let response;
            if (updateMode) {
                response = await axios.put(`http://127.0.0.1:8000/admin/Bepocart-Blog-update/${id}/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `${token}`,
                    },
                });
            } else {
                response = await axios.post("http://127.0.0.1:8000/admin/Bepocart-Blog-create/", formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `${token}`,
                    },
                });
            }
            setMessage("Form submitted successfully!");
            setSeverity("success");
            setOpen(true);
            console.log("Success", response.data);
            setState({
                title: "",
                file: null,
                content: ""
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
                            {updateMode ? 'Update Blog' : 'Create Blog'}
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <CardContent sx={{ padding: "30px" }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="title"
                            label="Title"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.title}
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
                        <TextField
                            name="content"
                            label="Content"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            sx={{ mb: 2 }}
                            value={state.content}
                            onChange={handleChange}
                        />

                        <Grid container spacing={0} sx={{ mb: 2 }}>
                        </Grid>
                        <div>
                            <Button type="submit" color="primary" variant="contained">
                                {updateMode ? 'Update' : 'Submit'}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default FbDefaultForm;
