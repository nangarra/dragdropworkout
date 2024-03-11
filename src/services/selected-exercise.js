import ApiService from "./ApiService";
const PRIFIX = "selected-exercise";

export async function saveWorkoutExercises(workoutId, data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${workoutId}/save`,
    method: "post",
    data,
  });
}
