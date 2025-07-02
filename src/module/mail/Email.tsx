import { Attachment } from "./Attachment";
import { Forward } from "./Forward";

export type Email = {
  id: number;
  message_id: string;
  subject: string;
  sender: string;
  content_text: string;
  content_html: string;
  date_sent: string;
  date_received: string;
  raw_headers: string;
  rfq: true | null;
  rfq_type: string | null;
  dispatcher_id: number | null;
};

export type WithAttachments<T> = T & {
  attachments: Attachment[];
};
export type WithForwards<T> = T & {
  forwards: Forward[];
};
