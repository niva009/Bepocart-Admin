import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

const SizeForm = ({ open, onClose, onSizeAdded, productId }) => {
    const [size, setSize] = useState("");
    const [quantity, setQuantity] = useState("");
    const { id } = useParams();  // Access the id parameter from the URL




    console.log("Product Id     :",id)

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!productId) {
            console.error("Error: Product ID not found");
            return;
        }

        try {
            const response = await axios.post(`http://127.0.0.1:8000/admin/Bepocart-product-varient/${productId}/`, {
                size,
                stock: quantity,
                product: parseInt(id)
            }, {
                headers: {
                    'Authorization': `Token ${token}`,
                },
            });
            onSizeAdded(response.data);
            onClose();
        } catch (error) {
            console.error("Error adding size:", error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Add Size and Quantity</DialogTitle>
            <DialogContent>
                <form onSubmit={handleSubmit}>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Size"
                        type="text"
                        fullWidth
                        value={size}
                        onChange={(e) => setSize(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Quantity"
                        type="number"
                        fullWidth
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    <DialogActions>
                        <Button onClick={onClose}>Cancel</Button>
                        <Button type="submit" variant="contained" color="primary">Add</Button>
                    </DialogActions>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SizeForm;
