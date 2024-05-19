// @mui material components
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ProfileInfoCard from "examples/Cards/InfoCards/ProfileInfoCard";
import ProfilesList from "examples/Lists/ProfilesList";
import DefaultProjectCard from "examples/Cards/ProjectCards/DefaultProjectCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import PlatformSettings from "layouts/profile/components/PlatformSettings";

// Data
import profilesListData from "layouts/profile/data/profilesListData";

// Images
import homeDecor1 from "assets/images/home-decor-1.jpg";
import homeDecor2 from "assets/images/home-decor-2.jpg";
import homeDecor3 from "assets/images/home-decor-3.jpg";
import homeDecor4 from "assets/images/home-decor-4.jpeg";
import team1 from "assets/images/team-1.jpg";
import team2 from "assets/images/team-2.jpg";
import team3 from "assets/images/team-3.jpg";
import team4 from "assets/images/team-4.jpg";
import EditProfile from "./components/EditProfile";
import { useState } from "react";
import UpdatePassword from "./components/UpdatePassword";
import { useMaterialUIController } from "context";

function Overview() {
  const [controller, dispatch] = useMaterialUIController();
  const { loggedInUser } = controller;

  const [openEditProfile, setOpenEditProfile] = useState(false);

  const onCloseEditProfile = () => {
    setOpenEditProfile(false);
  };
  const onOpenEditProfile = () => {
    setOpenEditProfile(true);
  };

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <EditProfile open={openEditProfile} onClose={onCloseEditProfile} />
      <MDBox p={2}>
        <Header>
          <MDBox mt={5} mb={3}>
            <Grid container spacing={1}>
              <Grid item xs={12} md={6} xl={4}>
                <ProfileInfoCard
                  title="profile information"
                  description={loggedInUser?.description}
                  info={{
                    fullName: loggedInUser?.username || "N/A",
                    mobile: loggedInUser?.phone || "N/A",
                    email: loggedInUser?.email || "N/A",
                    location: loggedInUser?.location || "N/A",
                  }}
                  social={loggedInUser?.socials}
                  action={{ onClick: onOpenEditProfile, tooltip: "Edit Profile" }}
                  shadow={false}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                {/* <PlatformSettings /> */}
                <UpdatePassword title="Change Password" />
              </Grid>
              {/* <Grid item xs={12} md={6} xl={4} sx={{ display: "flex" }}>
                <Divider orientation="vertical" sx={{ ml: -2, mr: 1 }} />
                <ProfilesList title="conversations" profiles={profilesListData} shadow={false} />
              </Grid> */}
            </Grid>
          </MDBox>
          {/* <MDBox pt={2} px={2} lineHeight={1.25}>
            <MDTypography variant="h6" fontWeight="medium">
              Projects
            </MDTypography>
            <MDBox mb={1}>
              <MDTypography variant="button" color="text">
                Architects design houses
              </MDTypography>
            </MDBox>
          </MDBox>
          <MDBox p={2}>
            <Grid container spacing={6}>
              <Grid item xs={12} md={6} xl={3}>
                <DefaultProjectCard
                  image={homeDecor1}
                  label="project #2"
                  title="modern"
                  description="As Uber works through a huge amount of internal management turmoil."
                  action={{
                    type: "internal",
                    route: "/pages/profile/profile-overview",
                    color: "info",
                    label: "view project",
                  }}
                  authors={[
                    { image: team1, name: "Elena Morison" },
                    { image: team2, name: "Ryan Milly" },
                    { image: team3, name: "Nick Daniel" },
                    { image: team4, name: "Peterson" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <DefaultProjectCard
                  image={homeDecor2}
                  label="project #1"
                  title="scandinavian"
                  description="Music is something that everyone has their own specific opinion about."
                  action={{
                    type: "internal",
                    route: "/pages/profile/profile-overview",
                    color: "info",
                    label: "view project",
                  }}
                  authors={[
                    { image: team3, name: "Nick Daniel" },
                    { image: team4, name: "Peterson" },
                    { image: team1, name: "Elena Morison" },
                    { image: team2, name: "Ryan Milly" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <DefaultProjectCard
                  image={homeDecor3}
                  label="project #3"
                  title="minimalist"
                  description="Different people have different taste, and various types of music."
                  action={{
                    type: "internal",
                    route: "/pages/profile/profile-overview",
                    color: "info",
                    label: "view project",
                  }}
                  authors={[
                    { image: team4, name: "Peterson" },
                    { image: team3, name: "Nick Daniel" },
                    { image: team2, name: "Ryan Milly" },
                    { image: team1, name: "Elena Morison" },
                  ]}
                />
              </Grid>
              <Grid item xs={12} md={6} xl={3}>
                <DefaultProjectCard
                  image={homeDecor4}
                  label="project #4"
                  title="gothic"
                  description="Why would anyone pick blue over pink? Pink is obviously a better color."
                  action={{
                    type: "internal",
                    route: "/pages/profile/profile-overview",
                    color: "info",
                    label: "view project",
                  }}
                  authors={[
                    { image: team4, name: "Peterson" },
                    { image: team3, name: "Nick Daniel" },
                    { image: team2, name: "Ryan Milly" },
                    { image: team1, name: "Elena Morison" },
                  ]}
                />
              </Grid>
            </Grid>
          </MDBox> */}
        </Header>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Overview;
