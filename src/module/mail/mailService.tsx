import { apiRequest } from "../../service/api-request/apiRequest";
import { Email, WithAttachments, WithForwards } from "./Email";

export type MailRequestParams = {
  current: number;
  pageSize: number;
  date_sent?: string;
};

export type MailResponse = {
  data: WithForwards<WithAttachments<Email>>[];
  total: number;
};

export async function getAllMails(params: MailRequestParams) {
  return apiRequest<MailResponse>("/emails", params);
}
