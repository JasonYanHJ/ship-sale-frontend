import { apiRequest } from "../../service/api-request/apiRequest";
import { Tag } from "./Tag";

export async function getAllTags() {
  return apiRequest<Tag[]>("/tags");
}

export async function updateTag(id: number, fields: Pick<Tag, "name">) {
  return apiRequest<Tag>(`/tags/update/${id}`, fields);
}

export async function storeTag(fields: Pick<Tag, "name">) {
  return apiRequest<Tag>("/tags/store/", fields);
}

export async function deleteTag(id: number) {
  return apiRequest(`/tags/destroy/${id}`);
}
