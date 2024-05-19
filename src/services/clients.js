import ApiService from "./ApiService";
const PRIFIX = "clients";

export async function getClients(options = {}) {
  const params = new URLSearchParams(options);
  return ApiService.fetchData({
    url: `${PRIFIX}/get-all?${params}`,
    method: "get",
  });
}

export async function getClient(workoutId) {
  return ApiService.fetchData({
    url: `${PRIFIX}/get-one/${workoutId}`,
    method: "get",
  });
}

export async function setClientRating(workoutId, rating) {
  return ApiService.fetchData({
    url: `${PRIFIX}/set-rating/${workoutId}/${rating}`,
    method: "post",
  });
}

export async function createClient(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/create`,
    method: "post",
    data,
  });
}

export async function deleteClient(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
