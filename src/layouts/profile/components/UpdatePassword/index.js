import { Card, CircularProgress, FormControl, FormHelperText } from "@mui/material";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import Notification from "components/Notification";
import { useMaterialUIController } from "context";
import { setToast } from "context";
import { isBoolean, isString } from "lodash";
import React, { useState } from "react";
import { updatePassword } from "services/user";

const UpdatePassword = ({ title }) => {
  const [, dispatch] = useMaterialUIController();

  const [values, setValues] = useState({
    currentPassword: null,
    password: null,
    confirmPassword: null,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setError] = useState({});

  const onCancel = () => {
    setValues({
      password: "",
      confirmPassword: "",
      currentPassword: "",
    });
    setError({
      password: false,
      confirmPassword: false,
      currentPassword: false,
    });
  };

  const handleChange = (event) => {
    const { value, name } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    setError((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, password, confirmPassword } = values;

    let errors = false;

    if (!currentPassword) {
      setError((prev) => ({ ...prev, currentPassword: true }));
      errors = true;
    }

    if (!password) {
      setError((prev) => ({ ...prev, password: true }));
      errors = true;
    }

    if (!confirmPassword || password !== confirmPassword) {
      setError((prev) => ({ ...prev, confirmPassword: true }));
      errors = true;
    }

    if (errors) {
      return;
    }
    setLoading(true);
    try {
      const response = await updatePassword({ currentPassword, password });
      onCancel();
      setToast(
        dispatch,
        <Notification type="success" title="Success!" content="Password updated!" />
      );
    } catch (error) {
      if (error?.response?.data?.message) {
        setError((prev) => ({ ...prev, currentPassword: error?.response?.data?.message }));
        setLoading(false);
        return;
      }
      setToast(
        dispatch,
        <Notification type="error" title="Something went wrong!" content={error?.message} />
      );
    }
    setLoading(false);
  };

  return (
    <Card sx={{ height: "100%", width: "100%", boxShadow: "none" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
      </MDBox>
      <MDBox p={2}>
        <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
          <FormControl fullWidth required error={errors.currentPassword}>
            <MDBox>
              <MDInput
                fullWidth
                type="text"
                name="currentPassword"
                label="Current Password"
                value={values.currentPassword}
                onChange={handleChange}
                error={errors.currentPassword}
              />
              {errors.currentPassword && isBoolean(errors.currentPassword) && (
                <FormHelperText>Enter Old Password !</FormHelperText>
              )}
              {errors.currentPassword && isString(errors.currentPassword) && (
                <FormHelperText>Invaid Current Password</FormHelperText>
              )}
            </MDBox>
          </FormControl>

          <FormControl fullWidth required error={errors.password}>
            <MDBox>
              <MDInput
                fullWidth
                type="text"
                name="password"
                label="New Password"
                value={values.password}
                onChange={handleChange}
                error={errors.password}
              />
              {errors.password && <FormHelperText>Enter New password !</FormHelperText>}
            </MDBox>
          </FormControl>

          <FormControl fullWidth required error={errors.confirmPassword}>
            <MDBox>
              <MDInput
                fullWidth
                type="text"
                name="confirmPassword"
                label="Confirm New Password"
                value={values.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
              />
              {errors.confirmPassword && <FormHelperText>Password mis match !</FormHelperText>}
            </MDBox>
          </FormControl>
          <div className="flex w-full items-center justify-end">
            <div className="flex w-fit items-center gap-2">
              <MDButton
                size="small"
                variant="contained"
                color="white"
                type="button"
                onClick={onCancel}
              >
                Cancel
              </MDButton>
              <MDButton size="small" variant="gradient" color="primary" type="submit">
                {loading && <CircularProgress size={10} color="white" />}&nbsp;Save
              </MDButton>
            </div>
          </div>
        </form>
      </MDBox>
    </Card>
  );
};

export default UpdatePassword;
