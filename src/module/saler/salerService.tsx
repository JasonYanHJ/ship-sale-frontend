import { apiRequest } from "../../service/api-request/apiRequest";
import { Saler, SalerWithTags } from "./Saler";

export async function getAllSalers() {
  return apiRequest<SalerWithTags[]>("/salers");
}

export async function updateSaler(id: number, fields: Partial<Saler>) {
  return apiRequest<SalerWithTags>(`/salers/update/${id}`, fields);
}

export async function storeSaler(fields: Partial<Saler>) {
  return apiRequest<SalerWithTags>("/salers/store/", fields);
}

export async function deleteSaler(id: number) {
  return apiRequest(`/salers/destroy/${id}`);
}

export async function updateSalerTagAutoForward(
  saler_id: number,
  tag_id: number,
  auto_forward: boolean
) {
  return apiRequest<SalerWithTags>(
    `/salers/update-tag-auto-forward/${saler_id}`,
    { tag_id, auto_forward }
  );
}
