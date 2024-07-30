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
    Grid,
    Alert,
    Snackbar,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    OutlinedInput,
    Chip,
    Checkbox,
    FormControlLabel,
} from "@mui/material";

const FbDefaultForm = () => {
    const [open, setOpen] = useState(false);
    const [severity, setSeverity] = useState("success");
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        offer_type: "BUY",
        get_option: "",
        amount: null,
        get_value: "",
        method: "",
        discount_percentage: "",
        offer_products: [],
        exclude_products: [],
        offer_category: [],
        excluded_offer_category: [],
        start_date: "",
        end_date: "",
        messages: "",
        shipping_charge: "",
        coupon_user_limit: "",
        coupon_use_order_limit: "",
        discount_allowd_coupons: [],
        is_active: "Allowd",
        discount_approved_products: [],
        discount_not_allowd_products: [],
        discount_approved_category: [],
        discount_not_allowd_category: [],




    });


    console.log("form Data     :", formData)
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [discount_products, setDiscountProducts] = useState([]);
    const [discount_category, setDiscountCategory] = useState([]);
    const [coupons, setCoupons] = useState([]);

    useEffect(() => {
        axios.get("http://51.20.129.52/admin/Bepocart-products/", {
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setProducts(response.data.data);
            setDiscountProducts(response.data.data);
            console.log("Products   :", response.data.data)

        });

        axios.get("http://51.20.129.52/admin/Bepocart-subcategories/", {
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setCategories(response.data.data);
            setDiscountCategory(response.data.data)
            console.log("Category   :", response.data.data)

        });

        axios.get("http://51.20.129.52/admin/Bepocart-promotion-coupen-views/", {
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        }).then((response) => {
            setCoupons(response.data);
            console.log("coupon   :", response.data)
        });

    }, []);


    const handleSubmit = (e) => {
        e.preventDefault();

        // Determine selected and unselected products
        let selectedProducts = [];
        let unselectedProducts = [];

        let selectedCategory = [];
        let unselectedCategory = [];

        if (formData.exclude_products.length > 0) {
            // Save all unselected products if any products are excluded
            unselectedProducts = products
                .filter(product => !formData.exclude_products.includes(product.id))
                .map(product => product.id);
        } else {
            // Save only selected products if no products are excluded
            selectedProducts = products
                .filter(product => formData.offer_products.includes(product.id))
                .map(product => product.id);
        }

        if (formData.excluded_offer_category.length > 0) {
            // Save all unselected categories if any categories are excluded
            unselectedCategory = categories  // Assuming `categories` is the list to filter from
                .filter(category => !formData.excluded_offer_category.includes(category.id))
                .map(category => category.id);
        } else {
            // Save only selected categories if no categories are excluded
            selectedCategory = categories  // Assuming `categories` is the list to filter from
                .filter(category => formData.offer_category.includes(category.id))
                .map(category => category.id);
        }

        // Update the payload based on conditions
        const payload = {
            ...formData,
            offer_products: formData.exclude_products.length > 0 ? unselectedProducts : selectedProducts,
            offer_category: formData.excluded_offer_category.length > 0 ? unselectedCategory : selectedCategory,

            amount: formData.amount ? parseInt(formData.amount, 10) : null
        };

        // Now `payload` contains either all unselected products or selected products,
        // depending on whether any products are excluded. Use `payload` for saving after form submission.


        axios.post("http://51.20.129.52/admin/Bepocart-offer/", payload, {
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            }
        })
            .then(response => {
                console.log("Offer created:", response.data);
                setOpen(true);
                setSeverity("success");
                setMessage("Offer created successfully");
                // Optionally, reset form data or handle success state
            })
            .catch(error => {
                console.error("Error creating offer:", error);
                setOpen(true);
                setSeverity("error");
                setMessage("Error creating offer. Please try again.");
                // Optionally, handle error state or display error message
            });
    };




    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));

        if (name === "method") {
            if (value === "FREE") {
                setFormData((prevState) => ({
                    ...prevState,
                    discount_percentage: "",
                }));
            } else if (value === "% OFF") {
                setFormData((prevState) => ({
                    ...prevState,
                    get_value: "",
                }));
            }
        }

        if (name === "offer_type") {
            if (value === "BUY") {
                setFormData((prevState) => ({
                    ...prevState,
                    get_option: "",
                }));
            } else if (value === "SPEND") {
                setFormData((prevState) => ({
                    ...prevState,
                    amount: "",
                }));
            }
        }
    };
    const handleCheckboxChange = (event) => {
        setFormData({ ...formData, is_active: event.target.checked });
    };

    const handleMultipleChange = (event, field) => {
        const { value } = event.target;
        setFormData((prevState) => {
            let updatedFormData = { ...prevState, [field]: value };

            // if (field === "exclude_products") {
            //     // Automatically set offer_products to all products that are not in exclude_products
            //     const excludedIds = new Set(value);
            //     const nonExcludedProducts = products.filter(product => !excludedIds.has(product.id));
            //     updatedFormData.offer_products = nonExcludedProducts.map(product => product.id);
            // } else if (field === "offer_products") {
            //     // Ensure excluded products are not in offer_products
            //     updatedFormData[field] = value.filter(id => !prevState.exclude_products.includes(id));
            // }


            return updatedFormData;
        });
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
                            Bogo
                        </Typography>
                    </Box>
                </Box>
                <Divider />
                <CardContent sx={{ padding: "30px" }}>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={12}>
                                <TextField
                                    name="name"
                                    label="TITLE"

                                    variant="outlined"
                                    fullWidth
                                    value={formData.name}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="h5" component="h1">
                                    DISCOUNT
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                    <InputLabel id="coupon-type-label">OFFER TYPE</InputLabel>
                                    <Select
                                        labelId="coupon-type-label"
                                        id="offer_type"
                                        name="offer_type"
                                        value={formData.offer_type}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Offer Type" />}
                                    >
                                        <MenuItem value="BUY">BUY</MenuItem>
                                        <MenuItem value="SPEND">SPEND</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {formData.offer_type === 'BUY' ? (
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        name="get_option"
                                        label="BUY"
                                        variant="outlined"
                                        fullWidth
                                        value={formData.get_option}
                                        onChange={handleChange}
                                        type="number"
                                        inputProps={{ min: 0, step: 1 }}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                            ) : null}

                            {formData.offer_type === 'SPEND' ? (
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        name="amount"
                                        label="Amount"
                                        variant="outlined"
                                        fullWidth
                                        value={formData.amount}
                                        onChange={handleChange}
                                        type="number"
                                        inputProps={{ min: 0, step: 1 }}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                            ) : null}


                            {formData.method !== "% OFF" && (
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        name="get_value"
                                        label="Get"
                                        variant="outlined"
                                        fullWidth
                                        value={formData.get_value}
                                        onChange={handleChange}
                                        type="number"
                                        inputProps={{ min: 0, step: 1 }}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                            )}
                            {formData.method === "% OFF" && (
                                <Grid item xs={3}>
                                    <TextField
                                        name="discount_percentage"
                                        label="Discount"
                                        variant="outlined"
                                        fullWidth
                                        value={formData.discount_percentage}
                                        onChange={handleChange}
                                        type="number"
                                        inputProps={{ min: 0, step: 1 }}
                                        sx={{ mb: 2 }}
                                    />
                                </Grid>
                            )}
                            <Grid item xs={12} sm={3}>
                                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                    <InputLabel id="method-label">METHOD</InputLabel>
                                    <Select
                                        labelId="method-label"
                                        id="method"
                                        name="method"
                                        value={formData.method}
                                        onChange={handleChange}
                                        input={<OutlinedInput label="Method" />}
                                    >
                                        <MenuItem value="FREE">FREE</MenuItem>
                                        <MenuItem value="% OFF">% OFF</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>


                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Typography variant="h5" component="h1">
                                        ELIGIBLE PRODUCTS
                                    </Typography>
                                </Grid>

                                {/* OFFER PRODUCTS */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <InputLabel id="offer-product-label">OFFER PRODUCT</InputLabel>
                                        <Select
                                            labelId="offer-product-label"
                                            id="offer_products"
                                            multiple
                                            value={formData.offer_products}
                                            onChange={(e) => handleMultipleChange(e, "offer_products")}
                                            input={<OutlinedInput label="Offer Product" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={products.find(p => p.id === value)?.name || value} />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {products.map((product) => (
                                                <MenuItem
                                                    key={product.id}
                                                    value={product.id}
                                                    disabled={formData.exclude_products.includes(product.id)}
                                                >
                                                    {product.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* EXCLUDED OFFER PRODUCTS */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <InputLabel id="offer-excluded-products-label">EXCLUDED OFFER PRODUCTS</InputLabel>
                                        <Select
                                            labelId="offer-excluded-products-label"
                                            id="exclude_products"
                                            multiple
                                            value={formData.exclude_products}
                                            onChange={(e) => handleMultipleChange(e, "exclude_products")}
                                            input={<OutlinedInput label="Excluded Offer Products" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={products.find(p => p.id === value)?.name || value} />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {products.map((product) => (
                                                <MenuItem
                                                    key={product.id}
                                                    value={product.id}
                                                    disabled={formData.offer_products.includes(product.id)}
                                                >
                                                    {product.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* OFFER CATEGORY */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <InputLabel id="offer-category-label">OFFER CATEGORY</InputLabel>
                                        <Select
                                            labelId="offer-category-label"
                                            id="offer_category"
                                            multiple
                                            value={formData.offer_category}
                                            onChange={(e) => handleMultipleChange(e, "offer_category")}
                                            input={<OutlinedInput label="Offer Category" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={categories.find(c => c.id === value)?.name || value} />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {categories.map((category) => (
                                                <MenuItem
                                                    key={category.id}
                                                    value={category.id}
                                                    disabled={formData.offer_products.length > 0 || formData.exclude_products.length > 0}
                                                >
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>

                                {/* EXCLUDED OFFER CATEGORY */}
                                <Grid item xs={12}>
                                    <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                        <InputLabel id="excluded-offer-category-label">EXCLUDED OFFER CATEGORY</InputLabel>
                                        <Select
                                            labelId="excluded-offer-category-label"
                                            id="excluded_offer_category"
                                            multiple
                                            value={formData.excluded_offer_category}
                                            onChange={(e) => handleMultipleChange(e, "excluded_offer_category")}
                                            input={<OutlinedInput label="Excluded Offer Category" />}
                                            renderValue={(selected) => (
                                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                    {selected.map((value) => (
                                                        <Chip key={value} label={categories.find(c => c.id === value)?.name || value} />
                                                    ))}
                                                </Box>
                                            )}
                                        >
                                            {categories.map((category) => (
                                                <MenuItem
                                                    key={category.id}
                                                    value={category.id}
                                                    disabled={formData.offer_products.length > 0 || formData.exclude_products.length > 0}
                                                >
                                                    {category.name}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                            <Card>
                                <CardContent>
                                    <form onSubmit={handleSubmit}>
                                        <Grid container spacing={2}>
                                            <Grid item xs={12}>
                                                <Typography variant="h5" component="h1">
                                                    DISCOUNTED PRODUCTS
                                                </Typography>
                                            </Grid>

                                            <Grid item xs={12}>
                                            <Typography variant="p" component="p">
                                                    Same as products is allowd
                                                </Typography>
                                                <FormControlLabel
                                                    control={
                                                        <Checkbox
                                                            checked={formData.is_active}
                                                            onChange={handleCheckboxChange}
                                                            name="is_active"
                                                            color="primary"
                                                        />
                                                    }
                                                    label={formData.is_active ? "Allowd" : "Not_allowd"}
                                                />
                                            </Grid>

                                            {!formData.is_active && (
                                                <>
                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                                            <InputLabel id="offer-product-label">DISCOUNTED PRODUCT</InputLabel>
                                                            <Select
                                                                labelId="offer-product-label"
                                                                id="discount_approved_products"
                                                                multiple
                                                                value={formData.discount_approved_products}
                                                                onChange={(e) => handleMultipleChange(e, "discount_approved_products")}
                                                                input={<OutlinedInput label="Discounted Product" />}
                                                                renderValue={(selected) => (
                                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                        {selected.map((value) => (
                                                                            <Chip key={value} label={discount_products.find(p => p.id === value)?.name || value} />
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                            >
                                                                {discount_products.map((product) => (
                                                                    <MenuItem
                                                                        key={product.id}
                                                                        value={product.id}
                                                                        disabled={formData.discount_not_allowd_products.includes(product.id)}
                                                                    >
                                                                        {product.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                                            <InputLabel id="offer-excluded-products-label">EXCLUDED DISCOUNT PRODUCTS</InputLabel>
                                                            <Select
                                                                labelId="offer-excluded-products-label"
                                                                id="discount_not_allowd_products"
                                                                multiple
                                                                value={formData.discount_not_allowd_products}
                                                                onChange={(e) => handleMultipleChange(e, "discount_not_allowd_products")}
                                                                input={<OutlinedInput label="Excluded Discount Products" />}
                                                                renderValue={(selected) => (
                                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                        {selected.map((value) => (
                                                                            <Chip key={value} label={discount_products.find(p => p.id === value)?.name || value} />
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                            >
                                                                {discount_products.map((product) => (
                                                                    <MenuItem
                                                                        key={product.id}
                                                                        value={product.id}
                                                                        disabled={formData.discount_approved_products.includes(product.id)}
                                                                    >
                                                                        {product.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                                            <InputLabel id="offer-category-label">DISCOUNTED CATEGORY</InputLabel>
                                                            <Select
                                                                labelId="offer-category-label"
                                                                id="discount_approved_category"
                                                                multiple
                                                                value={formData.discount_approved_category}
                                                                onChange={(e) => handleMultipleChange(e, "discount_approved_category")}
                                                                input={<OutlinedInput label="Discounted Category" />}
                                                                renderValue={(selected) => (
                                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                        {selected.map((value) => (
                                                                            <Chip key={value} label={discount_category.find(c => c.id === value)?.name || value} />
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                            >
                                                                {discount_category.map((category) => (
                                                                    <MenuItem
                                                                        key={category.id}
                                                                        value={category.id}
                                                                        disabled={formData.discount_approved_category.includes(category.id)}
                                                                    >
                                                                        {category.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>

                                                    <Grid item xs={12}>
                                                        <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                                            <InputLabel id="excluded-offer-category-label">EXCLUDED DISCOUNT CATEGORY</InputLabel>
                                                            <Select
                                                                labelId="excluded-offer-category-label"
                                                                id="discount_not_allowd_category"
                                                                multiple
                                                                value={formData.discount_not_allowd_category}
                                                                onChange={(e) => handleMultipleChange(e, "discount_not_allowd_category")}
                                                                input={<OutlinedInput label="Excluded Discount Category" />}
                                                                renderValue={(selected) => (
                                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                                        {selected.map((value) => (
                                                                            <Chip key={value} label={discount_category.find(c => c.id === value)?.name || value} />
                                                                        ))}
                                                                    </Box>
                                                                )}
                                                            >
                                                                {discount_category.map((category) => (
                                                                    <MenuItem
                                                                        key={category.id}
                                                                        value={category.id}
                                                                        disabled={formData.discount_not_allowd_category.includes(category.id)}
                                                                    >
                                                                        {category.name}
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </Grid>
                                                </>
                                            )}
                                        </Grid>
                                    </form>
                                </CardContent>
                            </Card>





                            <Grid item xs={12} >
                                <Typography variant="h5" component="h1">
                                    DATE AND TIME
                                </Typography>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="start_date"
                                    label="START DATE AND TIME"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.start_date}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                    type="datetime-local"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    name="end_date"
                                    label="END DATE AND TIME"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.end_date}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                    type="datetime-local"
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </Grid>


                            <Grid item xs={12}>
                                <Typography variant="h5" component="h1">
                                    RESTRICTION
                                </Typography>
                            </Grid>

                            <Grid item xs={12}>
                                <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
                                    <InputLabel id="excluded-offer-category-label">COUPONS</InputLabel>
                                    <Select
                                        labelId="excluded-offer-category-label"
                                        id="discount_allowd_coupons"
                                        multiple
                                        value={formData.discount_allowd_coupons}
                                        onChange={(e) => handleMultipleChange(e, "discount_allowd_coupons")}
                                        input={<OutlinedInput label="Excluded Offer Category" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => (
                                                    <Chip key={value} label={coupons.find(p => p.id === value)?.code || value} />
                                                ))}
                                            </Box>
                                        )}
                                    >
                                        {/* Replace with actual categories */}
                                        {coupons.map((product) => (
                                            <MenuItem key={product.id} value={product.id}>
                                                {product.code}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    name="messages"
                                    label="MESSAGE"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.message}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="shipping_charge"
                                    label="SHIPPING CHARGE"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.shipping_charge}
                                    onChange={handleChange}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="coupon_user_limit"
                                    label="COUPON USER LIMIT"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.coupon_user_limit}
                                    onChange={handleChange}
                                    type="number"
                                    inputProps={{ min: 0, step: 1 }}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    name="coupon_use_order_limit"
                                    label="USER ORDER LIMIT"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.coupon_use_order_limit}
                                    onChange={handleChange}
                                    type="number"
                                    inputProps={{ min: 0, step: 1 }}
                                    sx={{ mb: 2 }}
                                />
                            </Grid>
                        </Grid>
                        <Button type="submit" variant="contained" color="primary">
                            Submit
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div >
    );
};

export default FbDefaultForm;
