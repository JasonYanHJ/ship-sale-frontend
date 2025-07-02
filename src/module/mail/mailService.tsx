import { apiRequest } from "../../service/api-request/apiRequest";
import { Email, WithAttachments, WithForwards } from "./Email";

export type MailRequestParams = {
  current: number;
  pageSize: number;
  date_sent?: string;
  rfq_string?: string;

  // 通过rfq_string计算得出
  rfq?: true | null;
  rfq_type?: string | null;
};

export type MailResponse = {
  data: WithForwards<WithAttachments<Email>>[];
  total: number;
};

export async function getAllMails(params: MailRequestParams) {
  const processedParams = { ...params };

  // 处理rfq_string
  delete processedParams.rfq_string;
  if (params.rfq_string) {
    switch (params.rfq_string) {
      case "no_rfq":
        processedParams.rfq = null;
        break;
      case "rfq":
        processedParams.rfq = true;
        processedParams.rfq_type = null;
        break;
      default:
        processedParams.rfq = true;
        processedParams.rfq_type = params.rfq_string;
        break;
    }
  }

  return apiRequest<MailResponse>("/emails", processedParams);
}
