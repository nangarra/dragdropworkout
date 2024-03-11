import ApiService from "./ApiService";
const PRIFIX = "exercises";

export async function getExercises(options = {}) {
  const params = new URLSearchParams(options);
  return ApiService.fetchData({
    url: `${PRIFIX}/get-all?${params}`,
    method: "get",
  });
}

export async function saveExercise(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save`,
    method: "post",
    data,
  });
}

export async function deleteExercise(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
