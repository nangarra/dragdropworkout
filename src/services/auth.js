import ApiService from "./ApiService";
const PRIFIX = "auth";

export async function userSignIn(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/sign-in`,
    method: "post",
    data,
  });
}

export async function userSignOut(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/sign-out`,
    method: "get",
    data,
  });
}
