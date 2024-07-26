import React from "react";
import { Link as RouterLink } from "react-router-dom"; // Import Link from react-router-dom

import { Card, CardContent, Box, Typography, Button } from "@mui/material";

import ExTable from "./Table.js";

const BannerTable = () => {
  return (
    <Box position="relative">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Banner Table</Typography>
          {/* Add Banner Table Component */}
          <Box
            sx={{
              overflow: {
                xs: "auto",
                sm: "unset",
              },
            }}
          >
            <ExTable />
          </Box>
        </CardContent>
      </Card>
      {/* Add Banner Button Positioned at Top-Left */}
      <Button
        component={RouterLink}
        to="/banner-form/"
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
        Add Banner
      </Button>
    </Box>
  );
};

export default BannerTable;
