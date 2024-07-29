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
    Grid,
    Alert,
    Snackbar,
} from "@mui/material";

const FbDefaultForm = () => {
    const [state, setState] = useState({ coin: "", value: "", login_value: "", payment_value: "", first_payment_value: "",referral_point:"",review_reward:"",birthday_reward:"",anniversary_reward:""});
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setState((prevState) => ({ ...prevState, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post("http://51.20.129.52/admin/Bepocart-Bcoin/", state);
            setMessage("Coin created successfully");
            setSeverity("success");
            setOpen(true);
        } catch (error) {
            setMessage("Error creating coin");
            setSeverity("error");
            setOpen(true);
        }
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
                            COIN
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <CardContent sx={{ padding: "30px" }}>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            name="coin"
                            label="Quantity"
                            type="number"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.coin}
                            onChange={handleChange}
                        />
                        <TextField
                            name="value"
                            label="Value"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.value}
                            onChange={handleChange}
                        />
                        <TextField
                            name="login_value"
                            label="Login Value"
                            type="number"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.login_value}
                            onChange={handleChange}
                        />
                        <TextField
                            name="payment_value"
                            label="Payment Value"
                            type="number"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.payment_value}
                            onChange={handleChange}
                        />
                        <TextField
                            name="first_payment_value"
                            label=" First Payment Value"
                            type="number"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.first_payment_value}
                            onChange={handleChange}
                        />
                        <TextField
                            name="referral_point"
                            label=" Reffral Point"
                            type="number"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.referral_point}
                            onChange={handleChange}
                        />
                        <TextField
                            name="review_reward"
                            label=" Review Reward"
                            type="number"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.review_reward}
                            onChange={handleChange}
                        />

                        <TextField
                            name="birthday_reward"
                            label="Birthday Reward"
                            type="number"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.birthday_reward}
                            onChange={handleChange}
                        />

                        <TextField
                            name="anniversary_reward"
                            label="Anniversey Reward"
                            type="number"
                            variant="outlined"
                            fullWidth
                            sx={{ mb: 2 }}
                            value={state.anniversary_reward}
                            onChange={handleChange}
                        />
                        <Grid container spacing={0} sx={{ mb: 2 }}>
                        </Grid>
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

export default FbDefaultForm;
