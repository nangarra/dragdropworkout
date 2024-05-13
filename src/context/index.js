import { createContext, useContext, useReducer, useMemo } from "react";

// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 React main context
const MaterialUI = createContext();

// Setting custom name for the context which is visible on react dev tools
MaterialUI.displayName = "MaterialUIContext";

// Material Dashboard 2 React reducer
function reducer(state, action) {
  switch (action.type) {
    case "MINI_SIDENAV": {
      return { ...state, miniSidenav: action.value };
    }
    case "TRANSPARENT_SIDENAV": {
      return { ...state, transparentSidenav: action.value };
    }
    case "WHITE_SIDENAV": {
      return { ...state, whiteSidenav: action.value };
    }
    case "SIDENAV_COLOR": {
      return { ...state, sidenavColor: action.value };
    }
    case "TRANSPARENT_NAVBAR": {
      return { ...state, transparentNavbar: action.value };
    }
    case "FIXED_NAVBAR": {
      return { ...state, fixedNavbar: action.value };
    }
    case "OPEN_CONFIGURATOR": {
      return { ...state, openConfigurator: action.value };
    }
    case "DIRECTION": {
      return { ...state, direction: action.value };
    }
    case "LAYOUT": {
      return { ...state, layout: action.value };
    }
    case "DARKMODE": {
      return { ...state, darkMode: action.value };
    }
    case "TOAST": {
      return { ...state, toast: [action.value] };
    }
    case "LOGGEDINUSER": {
      return { ...state, loggedInUser: action.value };
    }

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

const STATES = {
  MINI_SIDENAV: "miniSidenav",
  TRANSPARENT_SIDENAV: "transparentSidenav",
  WHITE_SIDENAV: "whiteSidenav",
  SIDENAV_COLOR: "sidenavColor",
  TRANSPARENT_NAVBAR: "transparentNavbar",
  FIXED_NAVBAR: "fixedNavbar",
  OPEN_CONFIGURATOR: "openConfigurator",
  DIRECTION: "direction",
  LAYOUT: "layout",
  TOAST: "toast",
  DARKMODE: "darkMode",
  LOGGEDINUSER: "loggedInUser",
};

// Material Dashboard 2 React context provider
function MaterialUIControllerProvider({ children }) {
  const state = localStorage.getItem("CONTROLLER");
  const initialState = state
    ? JSON.parse(state)
    : {
        miniSidenav: false,
        transparentSidenav: false,
        whiteSidenav: true,
        sidenavColor: "primary",
        transparentNavbar: true,
        fixedNavbar: true,
        openConfigurator: false,
        direction: "ltr",
        layout: "page",
        toast: [],
        darkMode: false,
        loggedInUser: {},
      };

  const [controller, dispatch] = useReducer(reducer, initialState);

  const value = useMemo(() => [controller, dispatch], [controller, dispatch]);

  return <MaterialUI.Provider value={value}>{children}</MaterialUI.Provider>;
}

// Material Dashboard 2 React custom hook for using context
function useMaterialUIController() {
  const context = useContext(MaterialUI);

  if (!context) {
    throw new Error(
      "useMaterialUIController should be used inside the MaterialUIControllerProvider."
    );
  }

  return context;
}

// Typechecking props for the MaterialUIControllerProvider
MaterialUIControllerProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

const persist = (state, dispatch, controller) => {
  dispatch(state);

  if (STATES[state.type] === "toast") {
    controller[STATES[state.type]] = [...controller.toast, state.value];
  } else {
    controller[STATES[state.type]] = state.value;
  }

  localStorage.setItem("CONTROLLER", JSON.stringify(controller));
};

// Context module functions
const setMiniSidenav = (dispatch, value, controller) =>
  persist({ type: "MINI_SIDENAV", value }, dispatch, controller);
const setTransparentSidenav = (dispatch, value, controller) =>
  persist({ type: "TRANSPARENT_SIDENAV", value }, dispatch, controller);
const setWhiteSidenav = (dispatch, value, controller) =>
  persist({ type: "WHITE_SIDENAV", value }, dispatch, controller);
const setSidenavColor = (dispatch, value, controller) =>
  persist({ type: "SIDENAV_COLOR", value }, dispatch, controller);
const setTransparentNavbar = (dispatch, value, controller) =>
  persist({ type: "TRANSPARENT_NAVBAR", value }, dispatch, controller);
const setFixedNavbar = (dispatch, value, controller) =>
  persist({ type: "FIXED_NAVBAR", value }, dispatch, controller);
const setOpenConfigurator = (dispatch, value, controller) =>
  persist({ type: "OPEN_CONFIGURATOR", value }, dispatch, controller);
const setDirection = (dispatch, value, controller) =>
  persist({ type: "DIRECTION", value }, dispatch, controller);
const setLayout = (dispatch, value, controller) =>
  persist({ type: "LAYOUT", value }, dispatch, controller);
const setDarkMode = (dispatch, value, controller) =>
  persist({ type: "DARKMODE", value }, dispatch, controller);
const setToast = (dispatch, value) => dispatch({ type: "TOAST", value });
const setLoggedInUser = (dispatch, value, controller) =>
  persist({ type: "LOGGEDINUSER", value }, dispatch, controller);

export {
  MaterialUIControllerProvider,
  useMaterialUIController,
  setMiniSidenav,
  setTransparentSidenav,
  setWhiteSidenav,
  setSidenavColor,
  setTransparentNavbar,
  setFixedNavbar,
  setOpenConfigurator,
  setDirection,
  setLayout,
  setDarkMode,
  setToast,
  setLoggedInUser,
};
