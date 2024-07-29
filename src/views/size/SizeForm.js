import React, { useState } from "react";
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
} from "@mui/material";

const FbDefaultForm = () => {
    const [name, setName] = useState("");
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [severity, setSeverity] = useState("success");

    const handleChange = (e) => {
        setName(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post(
                "http://127.0.0.1:8000/admin/Bepocart-product-size/",
                {
                    name: name,
                },
                {
                    headers: {
                        'Authorization': `${token}`,
                    }
                }
            );
            setMessage("Form submitted successfully!");
            setSeverity("success");
            setOpen(true);
            console.log("Success", response.data);
            // Clear form state after success
            setName("");
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
                            Size Form
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <CardContent sx={{ padding: "30px" }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="name"
                            label="Name"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={name}
                            onChange={handleChange}
                        />
                        <div>
                            <Button type="submit" color="primary" variant="contained">
                                Submit
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default FbDefaultForm;
