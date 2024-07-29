import React from "react";
import { Link as RouterLink } from "react-router-dom"; 

import { Card, CardContent, Box, Typography, Button } from "@mui/material";

import ExTable from "./Table.js";

const CategoryTable = () => {
  return (
    <Box position="relative">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Category Table</Typography>
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
      <Button
        component={RouterLink}
        to="/category-form/"
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
        Add Category
      </Button>
    </Box>
  );
};

export default CategoryTable;
