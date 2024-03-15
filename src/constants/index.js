export const TOKEN = "TOKEN";
export const LOGGED_IN_USER = "loggedInUser";
export const TOKEN_TYPE = "Bearer ";
export const REQUEST_HEADER_AUTH_KEY = "Authorization";
export const SERVER_API = process.env.REACT_APP_SERVER_API
  ? `${process.env.REACT_APP_SERVER_API}/api`
  : "/api";
