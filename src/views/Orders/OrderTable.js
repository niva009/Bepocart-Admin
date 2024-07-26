import React, { useState } from "react";
import { Card, CardContent, Box, Typography, TextField, Button } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import TableBanner from "./Table";

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
          <Typography variant="h3">Orders Table</Typography>
          <Box my={5} display="flex" alignItems="center" gap={2}>
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
              overflowY: "auto",
              whiteSpace: "nowrap",
              maxWidth: "100%",
              maxHeight: "800px",
            }}
          >
            <TableBanner searchQuery={submittedQuery} />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProductTable;
