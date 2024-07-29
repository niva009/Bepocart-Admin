import React from "react";
import { Link as RouterLink } from "react-router-dom"; 

import { Card, CardContent, Box, Typography, Button } from "@mui/material";

import ExTable from "./Table.js";

const CategoryTable = () => {
  return (
    <Box position="relative">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">COIN</Typography>
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
      <Button
        component={RouterLink}
        to="/Bepocart-Coin/"
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
        Add Coin
      </Button>
    </Box>
  );
};

export default CategoryTable;
