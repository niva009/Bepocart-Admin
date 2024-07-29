import React from "react";
import { Card, CardContent, Box, Typography, Button } from "@mui/material";
import ExTable from "./Table.js";
import { Link as RouterLink } from "react-router-dom";


const ProductTable = () => {
  return (
    <Box position="relative">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Coupens Table</Typography>
          <Box
            sx={{
              overflowX: "auto",
              overflowY: "auto",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              maxHeight: "800px",
            }}
          >
            <ExTable />
          </Box>
        </CardContent>
      </Card>
      <Button
        component={RouterLink}
        to="/coupen-form/"
        variant="contained"
        color="success"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          mt: 2,
          ml: 125, // Adjusted for a more realistic margin
        }}
      >
        Add coupon
      </Button>
    </Box>
  );
};

export default ProductTable;
