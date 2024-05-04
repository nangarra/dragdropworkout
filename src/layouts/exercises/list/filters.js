import { Card, Grid, Icon } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import React from "react";

const Filters = (props) => {
  const { onAddNew } = props;
  return (
    <MDBox p={2}>
      <Grid container spacing={6}>
        <Grid item xs={12}>
          <Card>
            <MDBox
              mx={2}
              mt={-3}
              py={3}
              px={2}
              variant="gradient"
              bgColor="primary"
              borderRadius="lg"
              coloredShadow="primary"
            >
              <MDTypography
                variant="h6"
                color="white"
                className="flex w-full justify-between items-center"
              >
                Exercise Listings
                {!!onAddNew && (
                  <MDButton size="small" variant="contained" color="white" onClick={onAddNew}>
                    <Icon>add</Icon>&nbsp;Add New
                  </MDButton>
                )}
              </MDTypography>
            </MDBox>
            <MDBox pt={3}>
              <Grid container spacing={2} className="p-4">
                <Grid item xl={1.2}></Grid>
              </Grid>
            </MDBox>
          </Card>
        </Grid>
      </Grid>
    </MDBox>
  );
};

export default Filters;
