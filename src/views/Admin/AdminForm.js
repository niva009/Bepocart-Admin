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
    const [state, setState] = useState({
        username: "",
        email: "",
        firstName: "",
        lastName: "",
        password: "",
        confirmPassword: "",
    });

    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState("");

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    const handleChange = (e) => {
        setState({
            ...state,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Check if passwords match
        if (state.password !== state.confirmPassword) {
            setSeverity("error");
            setMessage("Passwords do not match");
            setOpen(true);
            return;
        }

        axios.post('http://51.20.129.52/admin/register/', {
            username: state.username,
            email: state.email,
            first_name: state.firstName, // Ensure this matches your backend field
            last_name: state.lastName, // Ensure this matches your backend field
            password: state.password,
            password_confirm: state.confirmPassword, // Include password confirmation
        })
        .then(response => {
            // Handle successful response
            setSeverity("success");
            setMessage("Form submitted successfully");
            setOpen(true);

            // Clear form fields after submission
            setState({
                username: "",
                email: "",
                firstName: "",
                lastName: "",
                password: "",
                confirmPassword: "",
            });
        })
        .catch(error => {
            // Handle error response
            setSeverity("error");
            setMessage("Error submitting form");
            setOpen(true);
        });
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
                            Admin Form
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <CardContent sx={{ padding: "30px" }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="username"
                            label="Username"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.username}
                            onChange={handleChange}
                        />
                        <TextField
                            name="email"
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.email}
                            onChange={handleChange}
                        />
                        <TextField
                            name="firstName"
                            label="First Name"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.firstName}
                            onChange={handleChange}
                        />
                        <TextField
                            name="lastName"
                            label="Last Name"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.lastName}
                            onChange={handleChange}
                        />
                        <TextField
                            name="password"
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.password}
                            onChange={handleChange}
                        />
                        <TextField
                            name="confirmPassword"
                            label="Retype Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.confirmPassword}
                            onChange={handleChange}
                        />

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
