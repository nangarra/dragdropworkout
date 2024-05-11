import { useState, useEffect } from "react";

// prop-types is a library for typechecking of props.
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Material Dashboard 2 React base styles
import breakpoints from "assets/theme/base/breakpoints";

// Images
import burceMars from "assets/images/bruce-mars.jpg";
import backgroundImage from "assets/images/bg-profile.jpeg";
import { LOGGED_IN_USER } from "constants";
import { NO_PROFILE_PIC } from "constants";
import { motion } from "framer-motion";
import { CircularProgress, IconButton } from "@mui/material";
import { saveLoggedInUser } from "services/user";

function Header({ children }) {
  const [tabsOrientation, setTabsOrientation] = useState("horizontal");
  // const [tabValue, setTabValue] = useState(0);
  const [hover, setHover] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState(null);
  const loggedInUser = JSON.parse(localStorage.getItem(LOGGED_IN_USER) || "");

  useEffect(() => {
    // A function that sets the orientation state of the tabs.
    function handleTabsOrientation() {
      return window.innerWidth < breakpoints.values.sm
        ? setTabsOrientation("vertical")
        : setTabsOrientation("horizontal");
    }

    /** 
     The event listener that's calling the handleTabsOrientation function when resizing the window.
    */
    window.addEventListener("resize", handleTabsOrientation);

    // Call the handleTabsOrientation function to set the state with the initial value.
    handleTabsOrientation();

    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleTabsOrientation);
  }, [tabsOrientation]);

  useEffect(() => {
    setAvatar(loggedInUser?.profilePic || NO_PROFILE_PIC);
  }, [loggedInUser]);

  // const handleSetTabValue = (event, newValue) => setTabValue(newValue);

  const onFileUpload = async (event) => {
    setLoading(true);

    const file = event.target.files[0];

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = async () => {
      const profilePic = reader.result;
      try {
        const response = await saveLoggedInUser({ profilePic });

        localStorage.setItem(LOGGED_IN_USER, JSON.stringify(response.data));
        setAvatar(response.data.profilePic);
      } catch (error) {}
    };

    reader.onerror = (error) => {
      console.error("Error converting file to base64:", error);
    };

    setLoading(false);
  };

  return (
    <MDBox position="relative" mb={5}>
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.primary.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        sx={{
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid item>
            <div
              className="relative"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              {loading && (
                <div className="absolute w-full h-full left-0 right-0 top-0 bottom-0 z-50 rounded-full grid h-full w-full justify-center items-center">
                  <CircularProgress size={10} color="main" className="" />
                </div>
              )}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: hover ? 1 : 0 }}
                className="absolute bg-black/20 w-full h-full left-0 right-0 top-0 bottom-0 z-50 rounded-full"
              >
                <div className="grid h-full w-full justify-center items-center">
                  <label htmlFor="upload-file">
                    <Icon className="text-white text-[25px] cursor-pointer">edit</Icon>
                    <input
                      hidden
                      id="upload-file"
                      name="thumbnail"
                      accept="image/*"
                      type="file"
                      onChange={onFileUpload}
                    />
                  </label>
                </div>
              </motion.div>

              <MDAvatar src={avatar} alt="profile-image" size="xl" shadow="sm" />
            </div>
          </Grid>
          <Grid item>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium">
                {loggedInUser?.username}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular">
                {loggedInUser?.Role?.name}
              </MDTypography>
            </MDBox>
          </Grid>
          {/* <Grid item xs={12} md={6} lg={4} sx={{ ml: "auto" }}>
            <AppBar position="static">
              <Tabs orientation={tabsOrientation} value={tabValue} onChange={handleSetTabValue}>
                <Tab
                  label="App"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      home
                    </Icon>
                  }
                />
                <Tab
                  label="Message"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      email
                    </Icon>
                  }
                />
                <Tab
                  label="Settings"
                  icon={
                    <Icon fontSize="small" sx={{ mt: -0.25 }}>
                      settings
                    </Icon>
                  }
                />
              </Tabs>
            </AppBar>
          </Grid> */}
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

// Setting default props for the Header
Header.defaultProps = {
  children: "",
};

// Typechecking props for the Header
Header.propTypes = {
  children: PropTypes.node,
};

export default Header;
