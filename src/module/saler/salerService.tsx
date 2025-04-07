import { apiRequest } from "../../service/api-request/apiRequest";
import { Saler, SalerWithTags } from "./Saler";

export async function getAllSalers() {
  return apiRequest<SalerWithTags[]>("/salers");
}

export async function updateSaler(
  id: number,
  fields: Pick<Saler, "name" | "email" | "description">
) {
  return apiRequest<SalerWithTags>(`/salers/update/${id}`, fields);
}

export async function storeSaler(
  fields: Pick<Saler, "name" | "email" | "description">
) {
  return apiRequest<SalerWithTags>("/salers/store/", fields);
}

export async function deleteSaler(id: number) {
  return apiRequest(`/salers/destroy/${id}`);
}
