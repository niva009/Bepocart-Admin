import React from "react";
import { Link as RouterLink } from "react-router-dom"; 

import { Card, CardContent, Box, Typography, Button } from "@mui/material";

import ExTable from "./CustomerCoinTable";

const CategoryTable = () => {
  return (
    <Box position="relative">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">USER COIN DATA</Typography>
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
    </Box>
  );
};

export default CategoryTable;
