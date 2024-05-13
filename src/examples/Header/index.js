import styled from "@emotion/styled";
import { Divider, Icon, IconButton, alpha } from "@mui/material";
import Menu from "@mui/material/Menu";
import MDAvatar from "components/MDAvatar";
import { NO_PROFILE_PIC } from "constants";
import { TOKEN } from "constants";
import { setLoggedInUser, useMaterialUIController } from "context";
import NotificationItem from "examples/Items/NotificationItem";
import { navbarIconButton } from "examples/Navbars/DashboardNavbar/styles";
import { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { userSignOut } from "services/auth";

let navLinks = [
  {
    path: "/workout-builder",
    label: "workout builder",
  },
  {
    path: "/workouts",
    label: "workouts",
  },
  {
    path: "/about-us",
    label: "about us",
  },
];

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "left",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    top: "50px !Important",
    right: "20%",
    left: "80% !Important",
    color: theme.palette.mode === "light" ? "rgb(55, 65, 81)" : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(theme.palette.primary.main, theme.palette.action.selectedOpacity),
      },
    },
  },
}));

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [controller, dispatch] = useMaterialUIController();
  const { loggedInUser } = controller;

  const mainRoute = loggedInUser?.SuperUser ? "admin" : "personal-trainer";

  const workspace = {
    path: loggedInUser?.SuperUser ? "/admin/exercises" : "/personal-trainer/workouts",
    label: "workspace",
  };

  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

  const handleOpenMenu = (event) => setOpenMenu(event.currentTarget);
  const handleCloseMenu = () => setOpenMenu(false);

  const handleSignout = async () => {
    await userSignOut();
    localStorage.removeItem(TOKEN);
    setLoggedInUser(dispatch, {}, controller);
  };

  const handleProfileClick = () => {
    navigate(`/${mainRoute}/profile`);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const HeaderComp = ({ children }) => {
    return (
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition duration-300 ease-in-out py-4 bg-white`}
      >
        {children}
      </header>
    );
  };

  return (
    <HeaderComp>
      <div className="flex justify-between items-center container mx-auto">
        {/* Logo or Title */}
        <NavLink to="/">
          <div className={`text-[#7560C5] text-[25px] cursor-pointer`}>
            <span className="">Drag</span>
            <span className="font-semibold">Drop</span>
            <span className="font-bold">Workout</span>
          </div>
        </NavLink>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-8 text-sm">
          {loggedInUser?.id && (
            <NavLink
              to={workspace.path}
              className={`text-[#7560C5] ${
                location.pathname === workspace.path ? "font-bold" : "font-normal"
              } transition duration-300 ease-in-out uppercase`}
            >
              {workspace.label}
            </NavLink>
          )}

          {navLinks.map((nav, index) => (
            <NavLink
              key={index}
              to={nav.path}
              className={`text-[#7560C5] ${
                location.pathname === nav.path ? "font-bold" : "font-normal"
              } transition duration-300 ease-in-out uppercase`}
            >
              {nav.label}
            </NavLink>
          ))}

          {!loggedInUser?.id && (
            <NavLink
              to="/sign-in"
              className={`text-[#7560C5] ${
                location.pathname === "/sign-in" ? "font-bold" : "font-normal"
              } transition duration-300 ease-in-out uppercase`}
            >
              sign in
            </NavLink>
          )}

          {loggedInUser?.id && (
            <div className="relative">
              <IconButton sx={navbarIconButton} size="small" disableRipple onClick={handleOpenMenu}>
                <MDAvatar
                  src={loggedInUser?.profilePic || NO_PROFILE_PIC}
                  alt="profile-image"
                  size="sm"
                  shadow="xs"
                />
              </IconButton>

              <StyledMenu
                id="demo-customized-menu"
                anchorEl={openMenu}
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
                <NotificationItem
                  icon={<Icon>logout</Icon>}
                  title="Sign out"
                  onClick={handleSignout}
                />
              </StyledMenu>
            </div>
          )}
        </nav>

        {/* Admin Button */}
      </div>
    </HeaderComp>
  );
};

export default Header;
