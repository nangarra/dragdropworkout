// Material Dashboard 2 React layouts
// import Dashboard from "layouts/dashboard";
// import Workouts from "layouts/workouts";
// import Tables from "layouts/tables";
// import Billing from "layouts/billing";
// import RTL from "layouts/rtl";
// import Notifications from "layouts/notifications";
// import Profile from "layouts/profile";
// import SignIn from "layouts/authentication/sign-in";
// import SignUp from "layouts/authentication/sign-up";

// @mui icons
import Icon from "@mui/material/Icon";
import { lazy } from "react";

const protectedRoutes = [
  {
    type: "collapse",
    name: "Exercises",
    key: "exercises",
    icon: <Icon fontSize="small">directions_run</Icon>,
    route: "/admin/exercises",
    links: ["exercises"],
    component: lazy(() => import("layouts/exercises/index.js")),
  },
  {
    type: "collapse",
    name: "Nutritions",
    key: "nutritions",
    icon: <Icon fontSize="small">brunch_dining</Icon>,
    route: "/admin/nutritions",
    links: ["nutritions"],
    component: lazy(() => import("layouts/nutritions/index.js")),
  },
  {
    type: "collapse",
    name: "Workouts",
    key: "workouts",
    icon: <Icon fontSize="small">fitness_center</Icon>,
    route: "/admin/workouts",
    links: ["workouts"],
    component: lazy(() => import("layouts/workouts/index.js")),
  },
  // {
  //   type: "collapse",
  //   name: "Dashboard",
  //   key: "dashboard",
  //   icon: <Icon fontSize="small">dashboard</Icon>,
  //   route: "/dashboard",
  //   component: <Dashboard />,
  // },
  // {
  //   type: "collapse",
  //   name: "Tables",
  //   key: "tables",
  //   icon: <Icon fontSize="small">table_view</Icon>,
  //   route: "/tables",
  //   component: <Tables />,
  // },
  // {
  //   type: "collapse",
  //   name: "Billing",
  //   key: "billing",
  //   icon: <Icon fontSize="small">receipt_long</Icon>,
  //   route: "/billing",
  //   component: <Billing />,
  // },
  // {
  //   type: "collapse",
  //   name: "RTL",
  //   key: "rtl",
  //   icon: <Icon fontSize="small">format_textdirection_r_to_l</Icon>,
  //   route: "/rtl",
  //   component: <RTL />,
  // },
  // {
  //   type: "collapse",
  //   name: "Notifications",
  //   key: "notifications",
  //   icon: <Icon fontSize="small">notifications</Icon>,
  //   route: "/notifications",
  //   component: <Notifications />,
  // },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile",
  //   icon: <Icon fontSize="small">person</Icon>,
  //   route: "/profile",
  //   component: <Profile />,
  // },
  // {
  //   type: "collapse",
  //   name: "Sign Up",
  //   key: "sign-up",
  //   icon: <Icon fontSize="small">assignment</Icon>,
  //   route: "/authentication/sign-up",
  //   component: <SignUp />,
  // },
];

const publicRoutes = [
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/admin/sign-in",
    component: lazy(() => import("layouts/authentication/sign-in/index.js")),
  },
  // {
  //   type: "collapse",
  //   name: "Home",
  //   key: "sign-in",
  //   icon: <Icon fontSize="small">login</Icon>,
  //   route: "/",
  //   component: lazy(() => import("layouts/home/index.js")),
  // },
];

const routes = {
  publicRoutes,
  protectedRoutes,
};

export default routes;
