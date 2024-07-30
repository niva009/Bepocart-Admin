import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Grid,
    Card,
    CardContent
} from '@mui/material';
import { styled } from '@mui/system';
import { useParams } from 'react-router-dom';
import logo from '../../../src/assets/images/bepocart.png';
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const InvoiceHeader = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
});

const InvoiceDetails = styled(Box)({
    marginBottom: '20px',
});

const InvoiceTable = styled(TableContainer)({
    marginBottom: '20px',
});

const InvoiceFooter = styled(Box)({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
});

const FullScreenBox = styled(Box)({
    width: '100%',
    height: '100%',
    padding: '20px',
    boxSizing: 'border-box',
});

const Invoice = () => {
    const { order_id } = useParams();
    const [orderData, setOrderData] = useState(null); // State to hold fetched order data

    useEffect(() => {
        const fetchOrderData = async () => {
            try {
                const response = await axios.get(`http://51.20.129.52/admin/Bepocart-Order-Bill/${order_id}/`);
                setOrderData(response.data);
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchOrderData();
    }, [order_id]);

    if (!orderData) {
        return <div>Loading...</div>;
    }

    // Calculate COD charge
    const codCharge = orderData.data.payment_method === 'COD' ? 40.00 : 0.00;

    // Calculate shipping charge
    const shippingCharge = parseFloat(orderData.data.total_amount) < 500 ? 60.00 : 0.00;

    // Calculate total amount
    const totalAmount = parseFloat(orderData.data.total_amount);

    // Function to handle PDF download
    const loadImage = (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve(img);
            img.onerror = (err) => reject(err);
            img.src = src;
        });
    };

    const downloadInvoice = async () => {
        const input = document.getElementById('invoice-container');
        if (!input) {
            console.error('Invoice container not found');
            return;
        }

        // Load all images first
        const images = Array.from(input.getElementsByTagName('img'));
        const loadImagesPromises = images.map(img => loadImage(img.src));

        try {
            await Promise.all(loadImagesPromises);
        } catch (error) {
            console.error('Error loading images:', error);
            return;
        }

        // Create canvas and PDF after images are loaded
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgWidth = 210;
            const pageHeight = 295;
            const imgHeight = (canvas.height * imgWidth) / canvas.width;
            let heightLeft = imgHeight;
            let position = 0;

            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
            heightLeft -= pageHeight;

            while (heightLeft >= 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
                heightLeft -= pageHeight;
            }

            pdf.save('invoice.pdf');
        }).catch(error => {
            console.error('Error converting to PDF:', error);
        });
    };

    return (
        <FullScreenBox>
            <div id="invoice-container">
                <Card variant="outlined" style={{ height: '100%' }}>
                    <CardContent style={{ height: '100%' }}>
                        <InvoiceHeader>
                            <Box>
                                <Typography variant="h4">INVOICE</Typography>
                                <Typography variant="body2" color="primary">{orderData.data.status}</Typography>
                            </Box>
                            <Box>
                                <img src={logo} alt="Company Logo" style={{ height: '100px' }} />
                            </Box>
                        </InvoiceHeader>
                        <InvoiceDetails>
                            <Grid container spacing={2}>
                                <Grid item xs={6}>
                                    <Typography variant="h6">DATE</Typography>
                                    <Typography variant="body2">{orderData.data.created_at}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6">INVOICE NO</Typography>
                                    <Typography variant="body2">{orderData.data.order_id}</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6">INVOICE FROM</Typography>
                                    <Typography variant="body2">
                                        Name: Bepocart
                                    </Typography>
                                    <Typography variant="body2">
                                        Address: Willington Island , 256314 , Valav thirinj moonnanmathe building
                                    </Typography>
                                    <Typography variant="body2">Email: Bepocart@gmail.com</Typography>
                                    <Typography variant="body2">Phone: 123456789</Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="h6">INVOICE TO</Typography>
                                    <Typography variant="body2">
                                        Name: {orderData.data.customerName} {orderData.data.lastName}
                                    </Typography>
                                    <Typography variant="body2">
                                        Address: {orderData.data.address}, {orderData.data.city}, {orderData.data.state}, {orderData.data.pincode}
                                    </Typography>
                                    <Typography variant="body2">Email: {orderData.data.email}</Typography>
                                    <Typography variant="body2">Phone: {orderData.data.phone}</Typography>
                                </Grid>
                            </Grid>
                        </InvoiceDetails>
                        <InvoiceTable component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>SR.</TableCell>
                                        {/* <TableCell>PRODUCT IMAGE</TableCell> */}
                                        <TableCell>PRODUCT TITLE</TableCell>
                                        <TableCell>QUANTITY</TableCell>
                                        <TableCell>ITEM PRICE</TableCell>
                                        <TableCell>AMOUNT</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {orderData.order_items.map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{index + 1}</TableCell>
                                            {/* <TableCell>
                                            <img src={`http://127.0.0.1:8000${item.productImage}`} alt={item.productName} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                                        </TableCell> */}
                                            <TableCell>{item.productName}</TableCell>
                                            <TableCell>{item.quantity}</TableCell>
                                            <TableCell>${item.price}</TableCell>
                                            <TableCell>
                                                <Typography color="error" style={{ fontWeight: 'bold' }}>
                                                    ${(item.quantity * parseFloat(item.price)).toFixed(2)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </InvoiceTable>
                        <InvoiceFooter>
                            <Box>
                                <Typography variant="h6">PAYMENT METHOD</Typography>
                                <Typography variant="body2">{orderData.data.payment_method}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6">COD CHARGE</Typography>
                                <Typography variant="body2">${codCharge.toFixed(2)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2">SHIPPING COST</Typography>
                                <Typography variant="body2">${shippingCharge.toFixed(2)}</Typography>
                            </Box>
                            <Box>
                                <Typography variant="body2">DISCOUNT</Typography>
                                <Typography variant="body2">$0.00</Typography>
                            </Box>
                            <Box>
                                <Typography variant="h6">TOTAL AMOUNT</Typography>
                                <Typography variant="h6" color="error" style={{ fontWeight: 'bold' }}>${totalAmount.toFixed(2)}</Typography>
                            </Box>
                        </InvoiceFooter>
                    </CardContent>
                </Card>
            </div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                <Button variant="contained" color="primary" onClick={downloadInvoice}>
                    Download Invoice
                </Button>
                <Button variant="contained" color="secondary">
                    Print Invoice
                </Button>
            </Box>
        </FullScreenBox>
    );
};

export default Invoice;
