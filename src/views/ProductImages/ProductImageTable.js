import React from "react";
// import { Link as RouterLink } from "react-router-dom";
import { Card, CardContent, Box, Typography } from "@mui/material";
import ExTable from "./Table.js";

const ProductImagesTable = () => {
  return (
    <Box position="relative">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Product Image Table</Typography>
          <Box
            sx={{
              overflowX: "auto",  // Allow horizontal scrolling
              overflowY: "hidden", // Prevent vertical scrolling
              whiteSpace: "nowrap", // Prevent wrapping of table content
              maxWidth: "100%", // Ensure it fits within the container
            }}
          >
            <ExTable />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductImagesTable;
