import axios from "axios";
import { LOGGED_IN_USER } from "constants";
import { REQUEST_HEADER_AUTH_KEY, TOKEN_TYPE, SERVER_API } from "constants";
import { TOKEN } from "constants";
import { Navigate } from "react-router-dom";

const unauthorizedCode = [401];
const UN_AUTHENTICATED_ENTRY_PATH = "/sign-in";

const BaseService = axios.create({
  baseURL: SERVER_API,
});

BaseService.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem(TOKEN);
    if (accessToken) {
      config.headers[REQUEST_HEADER_AUTH_KEY] = `${TOKEN_TYPE}${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

BaseService.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error;

    if (response && unauthorizedCode.includes(response.status)) {
      localStorage.removeItem(TOKEN);
      localStorage.removeItem(LOGGED_IN_USER);
      return <Navigate to={UN_AUTHENTICATED_ENTRY_PATH} replace />;
    }

    return Promise.reject(error);
  }
);

export default BaseService;
