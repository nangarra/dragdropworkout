import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import MDButton from "components/MDButton";
import React from "react";

const Confirmation = (props) => {
  const { open, title, message, onClose, onConfirm } = props;
  return (
    <Dialog
      fullScreen={false}
      open={open}
      onClose={onClose}
      aria-labelledby="responsive-dialog-title"
    >
      <DialogTitle id="responsive-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <MDButton size="small" variant="contained" color="white" onClick={onClose}>
          Cancel
        </MDButton>
        <MDButton size="small" variant="gradient" color="error" onClick={onConfirm}>
          Confirm
        </MDButton>
      </DialogActions>
    </Dialog>
  );
};

export default Confirmation;
