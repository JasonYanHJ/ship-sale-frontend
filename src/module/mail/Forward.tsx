export type Forward = {
  id: number;
  email_id: number;
  to_addresses: string[];
  cc_addresses: string[] | null;
  bcc_addresses: string[] | null;
  additional_message: string | null;
  forward_status: "sent" | "failed" | "pending";
  error_message: string | null;
  forwarded_at: string;
};
