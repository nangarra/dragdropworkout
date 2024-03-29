import ApiService from "./ApiService";
const PRIFIX = "nutritions";

export async function getNutritions(options = {}) {
  const params = new URLSearchParams(options);
  return ApiService.fetchData({
    url: `${PRIFIX}/get-all?${params}`,
    method: "get",
  });
}

export async function saveNutrition(data) {
  return ApiService.fetchData({
    url: `${PRIFIX}/save`,
    method: "post",
    data,
  });
}

export async function deleteNutrition(id) {
  return ApiService.fetchData({
    url: `${PRIFIX}/${id}`,
    method: "delete",
  });
}
