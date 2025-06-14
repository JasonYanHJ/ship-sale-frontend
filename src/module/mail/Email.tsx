import { Attachment } from "./Attachment";

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
};

export type EmailWithAttachments = Email & {
  attachments: Attachment[];
};
