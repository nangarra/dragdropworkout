import { useState } from "react";

// react-router-dom components
import { useNavigate } from "react-router-dom";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// @mui icons

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";

// Images
import bgImage from "assets/images/basic-bg.jpg";
import Notification from "components/Notification";
import { TOKEN } from "constants";
import { setToast, useMaterialUIController } from "context";
import { userSignIn } from "services/auth";
import { CircularProgress } from "@mui/material";
import CoverLayout from "../components/CoverLayout";
import { setLoggedInUser } from "context";
import { DEFAULT_ROLES } from "constants";

function Basic() {
  const [controller, dispatch] = useMaterialUIController();
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const [values, setValues] = useState({
    email: null,
    password: null,
  });

  const navigate = useNavigate();

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await userSignIn(values);
      localStorage.setItem(TOKEN, response?.data?.token);
      setLoggedInUser(dispatch, response?.data?.user, controller);

      const path = response?.data?.user?.SuperUser
        ? "/admin/exercises"
        : response?.data?.user?.Role?.name === DEFAULT_ROLES.PERSONAL_TRAINER
        ? "/personal-trainer/workouts"
        : "/client/workouts";
      navigate(path);
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

  return (
    <CoverLayout image={bgImage}>
      <Card style={{ width: 350 }}>
        <MDBox
          variant="gradient"
          bgColor="primary"
          borderRadius="lg"
          coloredShadow="primary"
          mx={2}
          mt={-3}
          p={2}
          mb={1}
          textAlign="center"
        >
          <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
            Sign in
          </MDTypography>
        </MDBox>
        <MDBox pt={4} pb={3} px={3}>
          <form onSubmit={handleSubmit}>
            <MDBox mb={2}>
              <MDInput
                required
                type="email"
                label="Email"
                fullWidth
                name="email"
                value={values.email}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox mb={2}>
              <MDInput
                required
                type="password"
                label="Password"
                fullWidth
                name="password"
                value={values.password}
                onChange={handleChange}
              />
            </MDBox>
            <MDBox display="flex" alignItems="center" ml={-1}>
              <Switch checked={rememberMe} onChange={handleSetRememberMe} />
              <MDTypography
                variant="button"
                fontWeight="regular"
                color="text"
                onClick={handleSetRememberMe}
                sx={{ cursor: "pointer", userSelect: "none", ml: -1 }}
              >
                &nbsp;&nbsp;Remember me
              </MDTypography>
            </MDBox>
            <MDBox mt={4} mb={1}>
              <MDButton
                variant="gradient"
                color="primary"
                fullWidth
                type="submit"
                disabled={loading}
              >
                {loading && <CircularProgress size={10} color="white" />}&nbsp;sign in
              </MDButton>
            </MDBox>
          </form>
        </MDBox>
      </Card>
    </CoverLayout>
  );
}

export default Basic;
