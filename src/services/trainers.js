import ApiService from "./ApiService";
const PRIFIX = "trainers";

export async function getTrainers(options = {}) {
  const params = new URLSearchParams(options);
  return ApiService.fetchData({
    url: `${PRIFIX}/get-all?${params}`,
    method: "get",
  });
}

export async function getTrainer(workoutId) {
  return ApiService.fetchData({
    url: `${PRIFIX}/get-one/${workoutId}`,
    method: "get",
  });
}

export async function setTrainerRating(workoutId, rating) {
  return ApiService.fetchData({
    url: `${PRIFIX}/set-rating/${workoutId}/${rating}`,
    method: "post",
  });
}

export async function createTrainer(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/create`,
    method: "post",
    data,
  });
}

export async function deleteTrainer(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
