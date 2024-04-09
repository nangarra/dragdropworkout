import { Box, CircularProgress } from "@mui/material";
import { motion } from "framer-motion";
import React from "react";

const scaleVariants = {
  scaleUp: { scale: 1.1 },
  scaleDown: { scale: 1 },
};

const transitionVariants = {
  duration: 0.5, // Half second duration
  yoyo: Infinity, // Repeat animation infinitely
};

const CircularIndeterminate = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <motion.img animate="scaleUp" variants={scaleVariants} transition={transitionVariants}>
        <CircularProgress />
      </motion.img>
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
