import { apiRequest } from "../../service/api-request/apiRequest";
import { EmailWithAttachments } from "./Email";

export async function getAllMails() {
  return apiRequest<EmailWithAttachments[]>("/emails");
}
