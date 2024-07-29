import React from "react";
// import { Link as RouterLink } from "react-router-dom";
import { Card, CardContent, Box, Typography } from "@mui/material";
import ExTable from "./OrderProducts.js";

const OrderProductsTable = () => {
  return (
    <Box position="relative">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Order Products</Typography>
          <Box
            sx={{
              overflowX: "auto",  
              overflowY: "hidden", 
              whiteSpace: "nowrap", 
              maxWidth: "100%", 
            }}
          >
            <ExTable />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderProductsTable;
