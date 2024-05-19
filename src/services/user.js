import ApiService from "./ApiService";
const PRIFIX = "users";

export async function saveLoggedInUser(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/update-user`,
    method: "post",
    data,
  });
}

export async function getUser(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/get-user/${id}`,
    method: "get",
  });
}

export async function updatePassword(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/update-password`,
    method: "post",
    data,
  });
}
