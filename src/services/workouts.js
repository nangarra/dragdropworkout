import ApiService from "./ApiService";
const PRIFIX = "workouts";

export async function getWorkouts(options = {}) {
  const params = new URLSearchParams(options);
  return ApiService.fetchData({
    url: `${PRIFIX}/get-all?${params}`,
    method: "get",
  });
}

export async function saveWorkout(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save`,
    method: "post",
    data,
  });
}

export async function deleteWorkout(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
