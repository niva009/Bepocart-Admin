import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
import {
    Typography,
    Box,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    TableFooter,
    TableContainer,
    Button,
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

const CoinTable = () => {
    const { id } = useParams(); // Accessing 'id' from URL params
    const [coins, setCoins] = useState([]);
    const [deleteCoinId, setDeleteCoinId] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [editCoinId, setEditCoinId] = useState(null);
    const [editDialogOpen, setEditDialogOpen] = useState(false);
    const [editedCoinQuantity, setEditedCoinQuantity] = useState("");
    const [editedCoinValue, setEditedCoinValue] = useState("");
    const [editedLoginValue, setEditedLoginValue] = useState("");
    const [editedPaymentValue, setEditedPaymentValue] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCoins();
    }, []);

    const fetchCoins = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://127.0.0.1:8000/admin/Bepocart-user-coins/${id}/`, {
                headers: {
                    'Authorization': `${token}`,
                },
            });

            if (Array.isArray(response.data.data)) {
                setCoins(response.data.data);
                console.log("dataaaaaaa    :",response.data.data);
            } else {
                console.error("Invalid data format:", response.data.data);
                setError("Invalid data format");
            }
        } catch (error) {
            console.error("Error fetching coins:", error);
            if (error.response && (error.response.status === 401 || error.response.status === 403)) {
                navigate('/login');
            } else {
                setError("Error fetching coins");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteConfirmation = (id) => {
        setDeleteCoinId(id);
        setDeleteDialogOpen(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error("User is not authenticated");
                return;
            }

            await axios.delete(`http://127.0.0.1:8000/admin/Bepocart-coin-delete/${deleteCoinId}/`, {
                headers: {
                    'Authorization': `${token}`,
                },
            });

            setCoins(coins.filter(coin => coin.id !== deleteCoinId));
            setDeleteDialogOpen(false);
        } catch (error) {
            console.error("Error deleting coin:", error);
        }
    };

    const handleCancelDelete = () => {
        setDeleteCoinId(null);
        setDeleteDialogOpen(false);
    };

    const handleUpdate = (id, coin, value, loginValue, paymentValue) => {
        setEditCoinId(id);
        setEditedCoinQuantity(coin);
        setEditedCoinValue(value);
        setEditedLoginValue(loginValue);
        setEditedPaymentValue(paymentValue);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setEditCoinId(null);
        setEditDialogOpen(false);
    };

    const handleSaveEdit = async () => {
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://127.0.0.1:8000/admin/Bepocart-coin-update/${editCoinId}/`, {
                coin: editedCoinQuantity,
                value: editedCoinValue,
                login_value: editedLoginValue,
                payment_value: editedPaymentValue,
            }, {
                headers: {
                    'Authorization': `${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const updatedCoins = coins.map(coin =>
                coin.id === editCoinId ? {
                    ...coin,
                    coin: editedCoinQuantity,
                    value: editedCoinValue,
                    login_value: editedLoginValue,
                    payment_value: editedPaymentValue,
                } : coin
            );
            setCoins(updatedCoins);
            setEditDialogOpen(false);
        } catch (error) {
            console.error("Error updating coin:", error);
        }
    };

    const calculateTotalAmount = () => {
        return coins.reduce((total, coin) => total + coin.amount, 0);
    };

    return (
        <>
            {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "200px" }}>
                    <CircularProgress />
                </Box>
            ) : error ? (
                <Typography variant="body1" color="error">{error}</Typography>
            ) : (
                <TableContainer>
                    <Table
                        aria-label="simple table"
                        sx={{
                            mt: 3,
                            whiteSpace: "nowrap",
                        }}
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>USER</TableCell>
                                <TableCell>AMOUNT</TableCell>
                                <TableCell>SOURCE</TableCell>
                                <TableCell>TIMELAPSE</TableCell>
                                <TableCell>DELETE</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {coins.map((coin) => (
                                <TableRow key={coin.id}>
                                    <TableCell>{coin.id}</TableCell>
                                    <TableCell>{coin.firstName} {coin.lastName}</TableCell>
                                    <TableCell>{coin.amount}</TableCell>
                                    <TableCell>{coin.source}</TableCell>
                                    <TableCell>{coin.timestamp}</TableCell>
                                    <TableCell>
                                        <Button
                                            color="secondary"
                                            onClick={() => handleDeleteConfirmation(coin.id)}
                                        >
                                            <DeleteIcon />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TableCell colSpan={2}><Typography variant="h6">Total Amount</Typography></TableCell>
                                <TableCell><Typography variant="h6">{calculateTotalAmount()}</Typography></TableCell>
                                <TableCell colSpan={3} />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </TableContainer>
            )}
            <Dialog
                open={deleteDialogOpen}
                onClose={handleCancelDelete}
            >
                <DialogTitle>Delete Coin</DialogTitle>
                <DialogContent>Are you sure you want to delete this coin?</DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelDelete} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleDelete} color="secondary">
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={editDialogOpen}
                onClose={handleEditDialogClose}
            >
                <DialogTitle>Edit Coin</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Quantity"
                        type="number"
                        fullWidth
                        value={editedCoinQuantity}
                        onChange={(e) => setEditedCoinQuantity(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Value"
                        type="number"
                        fullWidth
                        value={editedCoinValue}
                        onChange={(e) => setEditedCoinValue(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Login Value"
                        type="number"
                        fullWidth
                        value={editedLoginValue}
                        onChange={(e) => setEditedLoginValue(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Payment Value"
                        type="number"
                        fullWidth
                        value={editedPaymentValue}
                        onChange={(e) => setEditedPaymentValue(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleEditDialogClose} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleSaveEdit} color="primary">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default CoinTable;
