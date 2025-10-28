import { apiRequest } from "../../service/api-request/apiRequest";
import { Email, WithAttachments, WithForwards } from "./type/Email";

export type MailRequestParams = {
  current: number;
  pageSize: number;
  date_sent?: string;
  type?: string | null;
  from?: string | null;
  dispatched?: boolean;
  subject?: string;
  sender?: string;
};

export type MailResponse = {
  data: WithForwards<WithAttachments<Email>>[];
  total: number;
};

function processParams(params: MailRequestParams): MailRequestParams {
  const processedParams = {
    ...params,
    type: params.type === "NULL" ? null : params.type,
    from: params.from === "NULL" ? null : params.from,
  };

  return processedParams;
}

export async function getAllMails(params: MailRequestParams) {
  return apiRequest<MailResponse>("/emails", processParams(params));
}

export async function getAllMailsByDispatcher(params: MailRequestParams) {
  return apiRequest<MailResponse>(
    "/emails/by-dispatcher",
    processParams(params)
  );
}
