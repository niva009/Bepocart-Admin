import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Card, CardContent, Box, Typography, TextField, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import ExTable from "./Table.js";

const ProductTable = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [submittedQuery, setSubmittedQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = () => {
    setSubmittedQuery(searchQuery);
  };

  return (
    <Box position="relative">
      <Card variant="outlined">
        <CardContent>
          <Typography variant="h3">Product Table</Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <TextField
              label="Search"
              placeholder="Search by username / date"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              startIcon={<SearchIcon />}
            >
              Submit
            </Button>
          </Box>
          <Box
            sx={{
              overflowX: "auto",
              overflowY: "hidden",
              whiteSpace: "nowrap",
              maxWidth: "100%",
            }}
          >
            <ExTable searchQuery={submittedQuery} />
          </Box>
        </CardContent>
      </Card>
      <Button
        component={RouterLink}
        to="/product-form/"
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
        Add product
      </Button>
    </Box>
  );
};

export default ProductTable;
