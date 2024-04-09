import ApiService from "./ApiService";
const PRIFIX = "workouts";

export async function getWorkouts(options = {}) {
  const params = new URLSearchParams(options);
  return ApiService.fetchData({
    url: `${PRIFIX}/get-all?${params}`,
    method: "get",
  });
}

export async function getWorkout(workoutId) {
  return ApiService.fetchData({
    url: `${PRIFIX}/get-one/${workoutId}`,
    method: "get",
  });
}

export async function setWorkoutRating(workoutId, rating) {
  return ApiService.fetchData({
    url: `${PRIFIX}/set-rating/${workoutId}/${rating}`,
    method: "post",
  });
}

export async function createWorkout(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/create`,
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
