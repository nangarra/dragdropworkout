import { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import PropTypes from "prop-types";

import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";

import Breadcrumbs from "examples/Breadcrumbs";
import NotificationItem from "examples/Items/NotificationItem";

import {
  navbar,
  navbarContainer,
  navbarRow,
  navbarIconButton,
  navbarMobileMenu,
} from "examples/Navbars/DashboardNavbar/styles";

import {
  useMaterialUIController,
  setTransparentNavbar,
  setMiniSidenav,
  setOpenConfigurator,
} from "context";
import { Divider } from "@mui/material";
import { TOKEN } from "constants";
import { userSignOut } from "services/auth";
import MDAvatar from "components/MDAvatar";
import { setLoggedInUser } from "context";
import { NO_PROFILE_PIC } from "constants";

function DashboardNavbar({ absolute, light, isMini }) {
  const [navbarType, setNavbarType] = useState();
  const [controller, dispatch] = useMaterialUIController();
  const { miniSidenav, transparentNavbar, fixedNavbar, openConfigurator, darkMode, loggedInUser } =
    controller;
  const [openMenu, setOpenMenu] = useState(false);
  const route = useLocation().pathname.split("/").slice(1);
  const navigate = useNavigate();

  useEffect(() => {
    // Setting the navbar type
    if (fixedNavbar) {
      setNavbarType("sticky");
    } else {
      setNavbarType("static");
    }

    // A function that sets the transparent state of the navbar.
    function handleTransparentNavbar() {
      setTransparentNavbar(
        dispatch,
        (fixedNavbar && window.scrollY === 0) || !fixedNavbar,
        controller
      );
    }

    /** 
     The event listener that's calling the handleTransparentNavbar function when 
     scrolling the window.
    */
    window.addEventListener("scroll", handleTransparentNavbar);

    // Call the handleTransparentNavbar function to set the state with the initial value.
    handleTransparentNavbar();

    // Remove event listener on cleanup
    return () => window.removeEventListener("scroll", handleTransparentNavbar);
  }, [dispatch, fixedNavbar]);

  const handleMiniSidenav = () => setMiniSidenav(dispatch, !miniSidenav, controller);
  const handleConfiguratorOpen = () => setOpenConfigurator(dispatch, !openConfigurator, controller);
  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const mainRoute = loggedInUser?.SuperUser ? "admin" : "personal-trainer";

  const handleSignout = async () => {
    await userSignOut();
    localStorage.removeItem(TOKEN);
    setLoggedInUser(dispatch, {}, controller);
    navigate(`/sign-in`);
  };

  const handleProfileClick = () => {
    navigate(`/${mainRoute}/profile`);
  };

  // Render the notifications menu
  const renderMenu = () => (
    <Menu
      anchorEl={openMenu}
      anchorReference={null}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      open={Boolean(openMenu)}
      onClose={handleCloseMenu}
    >
      <NotificationItem icon={<Icon>person</Icon>} title={loggedInUser?.username} />
      <NotificationItem icon={<Icon>email</Icon>} title={loggedInUser?.email} />
      <NotificationItem
        icon={<Icon>account_circle</Icon>}
        title="Profile"
        onClick={handleProfileClick}
      />
      <Divider />
      <NotificationItem icon={<Icon>logout</Icon>} title="Sign out" onClick={handleSignout} />
    </Menu>
  );

  // Styles for the navbar icons
  const iconsStyle = ({ palette: { dark, white, text }, functions: { rgba } }) => ({
    color: () => {
      let colorValue = light || darkMode ? white.main : dark.main;

      if (transparentNavbar && !light) {
        colorValue = darkMode ? rgba(text.main, 0.6) : text.main;
      }

      return colorValue;
    },
  });

  return (
    <AppBar
      position={absolute ? "absolute" : navbarType}
      color="inherit"
      sx={(theme) => navbar(theme, { transparentNavbar, absolute, light, darkMode })}
      style={{
        borderRadius: 0,
      }}
    >
      <div className="bg-white dark:bg-gray-700">
        <Toolbar sx={(theme) => navbarContainer(theme)}>
          <MDBox color="inherit" mb={{ xs: 1, md: 0 }} sx={(theme) => navbarRow(theme, { isMini })}>
            <Breadcrumbs icon="home" title={route[route.length - 1]} route={route} light={light} />
          </MDBox>
          {isMini ? null : (
            <MDBox sx={(theme) => navbarRow(theme, { isMini })}>
              <MDBox color={light ? "white" : "inherit"}>
                <NavLink
                  to={`/${mainRoute}/workouts`}
                  className={`text-[#7560C5] font-bold transition duration-300 ease-in-out uppercase text-sm mr-8`}
                >
                  workspace
                </NavLink>

                <NavLink
                  to="/workout-builder"
                  className={`text-[#7560C5] font-normal transition duration-300 ease-in-out uppercase text-sm mr-8`}
                >
                  workout builder
                </NavLink>

                <IconButton
                  size="medium"
                  disableRipple
                  color="inherit"
                  sx={navbarMobileMenu}
                  onClick={handleMiniSidenav}
                >
                  <Icon sx={iconsStyle} fontSize="medium">
                    {miniSidenav ? "menu_open" : "menu"}
                  </Icon>
                </IconButton>

                <IconButton
                  size="medium"
                  disableRipple
                  color="inherit"
                  sx={navbarIconButton}
                  onClick={handleConfiguratorOpen}
                >
                  <Icon sx={iconsStyle}>settings</Icon>
                </IconButton>

                <IconButton
                  sx={navbarIconButton}
                  size="medium"
                  disableRipple
                  onClick={handleOpenMenu}
                >
                  <MDAvatar
                    src={loggedInUser?.profilePic || NO_PROFILE_PIC}
                    alt="profile-image"
                    size="xs"
                    shadow="xs"
                  />
                  {/* <Icon sx={iconsStyle}>account_circle</Icon> */}
                </IconButton>
                {renderMenu()}
              </MDBox>
            </MDBox>
          )}
        </Toolbar>
      </div>
    </AppBar>
  );
}

// Setting default values for the props of DashboardNavbar
DashboardNavbar.defaultProps = {
  absolute: false,
  light: false,
  isMini: false,
};

// Typechecking props for the DashboardNavbar
DashboardNavbar.propTypes = {
  absolute: PropTypes.bool,
  light: PropTypes.bool,
  isMini: PropTypes.bool,
};

export default DashboardNavbar;
