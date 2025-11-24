import { Attachment } from "./Attachment";
import { Forward } from "./Forward";

export type Email = {
  id: number;
  message_id: string;
  subject: string;
  sender: string;
  recipients: string[] | null;
  cc: string[] | null;
  content_text: string;
  content_html: string;
  date_sent: string;
  date_received: string;
  raw_headers: string;
  type: "ORDER" | "RFQ" | "REMINDER" | "MESSAGE" | null;
  from_system: "ShipServ" | "Procure" | null;
  dispatcher_id: number | null;
};

export const INFO_DISPLAY_COLOR: { [key: string]: string } = {
  ShipServ: "#69e4dd",
  Procure: "#428dc7",
  询价: "blue",
  订单: "gold",
};

export type WithAttachments<T> = T & {
  attachments: Attachment[];
};
export type WithForwards<T> = T & {
  forwards: Forward[];
};
