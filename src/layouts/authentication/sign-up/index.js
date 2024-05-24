import { Link, useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Checkbox from "@mui/material/Checkbox";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import CoverLayout from "layouts/authentication/components/CoverLayout";

// Images
import bgImage from "assets/images/basic-bg.jpg";
import { Box, CircularProgress, Icon, IconButton, Modal } from "@mui/material";
import useOptimalModalHeight from "hooks/useOptimalHeight";
import { useState } from "react";
import { userSignUp } from "services/auth";
import { setToast } from "context";
import Notification from "components/Notification";
import { useMaterialUIController } from "context";
import { setLoggedInUser } from "context";
import { TOKEN } from "constants";
import { DEFAULT_ROLES } from "constants";

function SignUp({ open, close }) {
  const handleCloseSignup = () => close();
  const coverHeight = useOptimalModalHeight();
  const [controller, dispatch] = useMaterialUIController();

  const navigate = useNavigate();

  const [agreement, setAgreement] = useState(false);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState({});

  const style = {
    top: "50%",
    left: "50%",
    width: "100%",
    boxShadow: 24,
    maxWidth: 1200,
    overflow: "hidden",
    height: coverHeight,
    borderRadius: "10px",
    position: "absolute",
    bgcolor: "background.paper",
    transform: "translate(-50%, -50%)",
  };

  const handleChange = (e) => {
    const { value, name } = e.target;

    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      values.type = DEFAULT_ROLES.PERSONAL_TRAINER;
      const response = await userSignUp(values);
      localStorage.setItem(TOKEN, response?.data?.token);
      setLoggedInUser(dispatch, response?.data?.user, controller);
      setToast(
        dispatch,
        <Notification
          type="success"
          title={`Welcome ${response?.data?.user?.username}`}
          content={`Registration successful`}
        />,
        controller
      );

      if (window.location.pathname === "/register") {
        navigate("/personal-trainer/workouts");
      } else {
        handleCloseSignup();
      }
    } catch (error) {
      setToast(
        dispatch,
        <Notification
          type="error"
          title="Something went wrong"
          content={error?.response?.data?.message || error?.message}
        />,
        controller
      );
    }
    setLoading(false);
  };

  if (window.location.pathname === "/register") {
    return (
      <CoverLayout image={bgImage}>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="primary"
            borderRadius="lg"
            coloredShadow="success"
            mx={2}
            mt={-3}
            p={3}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Join us today
            </MDTypography>
            <MDTypography display="block" variant="button" color="white" my={1}>
              Enter your email and password to register
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form" onSubmit={handleSubmit}>
              <MDBox mb={2}>
                <MDInput
                  required
                  fullWidth
                  type="text"
                  label="Name"
                  name="username"
                  value={values.username}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  required
                  fullWidth
                  name="email"
                  type="email"
                  label="Email"
                  value={values.email}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  required
                  fullWidth
                  name="password"
                  type="password"
                  label="Password"
                  value={values.password}
                  onChange={handleChange}
                />
              </MDBox>
              <MDBox display="flex" alignItems="center" ml={-1}>
                <Checkbox
                  value={agreement}
                  checked={agreement}
                  onClick={() => setAgreement((prev) => !prev)}
                />
                <MDTypography
                  variant="button"
                  fontWeight="regular"
                  color="text"
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                >
                  &nbsp;&nbsp;I agree the&nbsp;
                </MDTypography>
                <MDTypography
                  component="a"
                  href="#"
                  variant="button"
                  fontWeight="bold"
                  color="primary"
                  textGradient
                >
                  Terms and Conditions
                </MDTypography>
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton
                  disabled={
                    !values.username || !values.email || !values.password || !agreement || loading
                  }
                  variant="gradient"
                  color="primary"
                  type="submit"
                  fullWidth
                >
                  {loading && <CircularProgress size={10} color="white" />}&nbsp;Register
                </MDButton>
              </MDBox>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="button" color="text">
                  Already have an account?{" "}
                  <MDTypography
                    textGradient
                    to="/sign-in"
                    color="primary"
                    variant="button"
                    component={Link}
                    fontWeight="medium"
                  >
                    Sign In
                  </MDTypography>
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </CoverLayout>
    );
  }
  return (
    <Modal
      open={open}
      onClose={handleCloseSignup}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <IconButton
          color="primary"
          aria-label="Add"
          style={{ position: "absolute", right: 5, top: 5, zIndex: 50 }}
          onClick={handleCloseSignup}
        >
          <Icon fontSize="medium">close</Icon>
        </IconButton>
        <CoverLayout image={bgImage} coverHeight={coverHeight}>
          <Card>
            <MDBox
              variant="gradient"
              bgColor="primary"
              borderRadius="lg"
              coloredShadow="success"
              mx={2}
              mt={-3}
              p={3}
              mb={1}
              textAlign="center"
            >
              <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
                Join us today
              </MDTypography>
              <MDTypography display="block" variant="button" color="white" my={1}>
                Enter your email and password to register
              </MDTypography>
            </MDBox>
            <MDBox pt={4} pb={3} px={3}>
              <MDBox component="form" role="form" onSubmit={handleSubmit}>
                <MDBox mb={2}>
                  <MDInput
                    required
                    fullWidth
                    type="text"
                    label="Name"
                    name="username"
                    value={values.username}
                    onChange={handleChange}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    required
                    fullWidth
                    name="email"
                    type="email"
                    label="Email"
                    value={values.email}
                    onChange={handleChange}
                  />
                </MDBox>
                <MDBox mb={2}>
                  <MDInput
                    required
                    fullWidth
                    name="password"
                    type="password"
                    label="Password"
                    value={values.password}
                    onChange={handleChange}
                  />
                </MDBox>
                <MDBox display="flex" alignItems="center" ml={-1}>
                  <Checkbox
                    value={agreement}
                    checked={agreement}
                    onClick={() => setAgreement((prev) => !prev)}
                  />
                  <MDTypography
                    variant="button"
                    fontWeight="regular"
                    color="text"
                    sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
                  >
                    &nbsp;&nbsp;I agree the&nbsp;
                  </MDTypography>
                  <MDTypography
                    component="a"
                    href="#"
                    variant="button"
                    fontWeight="bold"
                    color="primary"
                    textGradient
                  >
                    Terms and Conditions
                  </MDTypography>
                </MDBox>
                <MDBox mt={4} mb={1}>
                  <MDButton
                    disabled={
                      !values.username || !values.email || !values.password || !agreement || loading
                    }
                    variant="gradient"
                    color="primary"
                    type="submit"
                    fullWidth
                  >
                    {loading && <CircularProgress size={10} color="white" />}&nbsp;Register
                  </MDButton>
                </MDBox>
                <MDBox mt={3} mb={1} textAlign="center">
                  <MDTypography variant="button" color="text">
                    Already have an account?{" "}
                    <MDTypography
                      textGradient
                      to="/sign-in"
                      color="primary"
                      variant="button"
                      component={Link}
                      fontWeight="medium"
                    >
                      Sign In
                    </MDTypography>
                  </MDTypography>
                </MDBox>
              </MDBox>
            </MDBox>
          </Card>
        </CoverLayout>
      </Box>
    </Modal>
  );
}

export default SignUp;
