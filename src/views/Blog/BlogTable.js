import React from "react";
import { Link as RouterLink } from "react-router-dom"; // Import Link from react-router-dom

import { Card, CardContent, Box, Typography, Button } from "@mui/material";

import BlogTable from "./Table.js";

const BannerTable = () => {
  return (
    <Box position="relative">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Blog Table</Typography>
          {/* Add Banner Table Component */}
          <Box
            sx={{
              overflowX: "auto",  // Allow horizontal scrolling
              overflowY: "hidden", // Prevent vertical scrolling
              whiteSpace: "nowrap", // Prevent wrapping of table content
              maxWidth: "100%", // Ensure it fits within the container
            }}
          >
            <BlogTable />
          </Box>
        </CardContent>
      </Card>
      {/* Add Banner Button Positioned at Top-Left */}
      <Button
        component={RouterLink}
        to="/blog-form/"
        variant="contained"
        color="success"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          mt: 2,
          ml: 125,
        }}
      >
        Add Blog
      </Button>
    </Box>
  );
};

export default BannerTable;
