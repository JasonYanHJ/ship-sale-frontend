import { apiRequest } from "../../service/api-request/apiRequest";
import { Email, WithAttachments, WithForwards } from "./Email";

export async function getAllMails() {
  return apiRequest<WithForwards<WithAttachments<Email>>[]>("/emails");
}
