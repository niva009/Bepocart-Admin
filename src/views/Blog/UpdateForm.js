import React from "react";

import { Grid } from "@mui/material";

import { FbDefaultForm } from "./UpdateIndex";

const FormLayouts = () => {
  return (
    <Grid container spacing={0}>
      <Grid item lg={12} md={12} xs={12}>
        <FbDefaultForm />
      </Grid>
    </Grid>
  );
};

export default FormLayouts;
