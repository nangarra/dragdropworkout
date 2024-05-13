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
    component: lazy(() => import("layouts/admin-workouts/index.js")),
  },
  {
    type: "collapse",
    name: "Clients",
    key: "clients",
    icon: <Icon fontSize="small">people_outline</Icon>,
    route: "/admin/clients",
    links: ["clients"],
    component: lazy(() => import("layouts/clients/index.js")),
  },
  {
    type: "divider",
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">account_circle</Icon>,
    route: "/admin/profile",
    links: ["profile"],
    component: lazy(() => import("layouts/profile/index.js")),
  },
];

const trainerRoutes = [
  {
    type: "collapse",
    name: "Workouts",
    key: "workouts",
    icon: <Icon fontSize="small">fitness_center</Icon>,
    route: "/personal-trainer/workouts",
    links: ["workouts"],
    component: lazy(() => import("layouts/admin-workouts/index.js")),
  },
  {
    type: "collapse",
    name: "Clients",
    key: "clients",
    icon: <Icon fontSize="small">people_outline</Icon>,
    route: "/personal-trainer/clients",
    links: ["clients"],
    component: lazy(() => import("layouts/clients/index.js")),
  },
  {
    type: "divider",
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">account_circle</Icon>,
    route: "/personal-trainer/profile",
    links: ["profile"],
    component: lazy(() => import("layouts/profile/index.js")),
  },
];

const clientRoutes = [
  {
    type: "collapse",
    name: "Workouts",
    key: "workouts",
    icon: <Icon fontSize="small">fitness_center</Icon>,
    route: "/client/workouts",
    links: ["workouts"],
    component: lazy(() => import("layouts/admin-workouts/index.js")),
  },
  // {
  //   type: "collapse",
  //   name: "Trainers",
  //   key: "trainers",
  //   icon: <Icon fontSize="small">people_outline</Icon>,
  //   route: "/client/trainers",
  //   links: ["trainers"],
  //   component: lazy(() => import("layouts/trainers/index.js")),
  // },
  {
    type: "divider",
  },
  {
    type: "collapse",
    name: "Profile",
    key: "profile",
    icon: <Icon fontSize="small">account_circle</Icon>,
    route: "/client/profile",
    links: ["profile"],
    component: lazy(() => import("layouts/profile/index.js")),
  },
];

const publicRoutes = [
  {
    type: "collapse",
    name: "Sign In",
    key: "sign-in",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/sign-in",
    component: lazy(() => import("layouts/authentication/sign-in/index.js")),
  },
  {
    type: "collapse",
    name: "Workouts",
    key: "workouts",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/workouts",
    component: lazy(() => import("layouts/workouts/index.js")),
  },
  {
    type: "collapse",
    name: "Workout",
    key: "workout",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/workouts/:workout",
    component: lazy(() => import("layouts/created-workouts/index.js")),
  },
  {
    type: "collapse",
    name: "Workout Builder",
    key: "workout-builder",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/workout-builder",
    component: lazy(() => import("layouts/workout-builder/index.js")),
  },
  {
    type: "collapse",
    name: "Invitations",
    key: "invitations",
    icon: <Icon fontSize="small">login</Icon>,
    route: "/invitations/:trainerId",
    component: lazy(() => import("layouts/clients/client-invites/index.js")),
  },
];

const routes = { publicRoutes, protectedRoutes, trainerRoutes, clientRoutes };

export default routes;
