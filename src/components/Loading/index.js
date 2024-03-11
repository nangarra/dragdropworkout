import { Box, CircularProgress } from "@mui/material";
import React from "react";

const CircularIndeterminate = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <CircularProgress />
    </Box>
  );
};

const Loading = ({ loading = false, customLoader, children }) => {
  if (loading) {
    return !!customLoader ? customLoader : <CircularIndeterminate />;
  }

  return <>{children}</>;
};

export default Loading;
