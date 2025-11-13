import { Tag } from "../../tag/Tag";

export type Attachment = {
  id: number;
  email_id: number;
  original_filename: string;
  stored_filename: string;
  file_path: string;
  file_size: number;
  content_type: string;
  content_disposition_type: string;
  tags: Tag[];
  extra: BaseExtra | null;
};

export type BaseExtra = {
  type: string;
  version: number;
};

export type ShipServExtra = BaseExtra & {
  type: "ShipServ";
  version: 2;
  table_data: (string | null)[][][];
  section_data: Record<string, string>[];
  meta_data: Record<string, string>;
};

export type ProcureExtra = BaseExtra & {
  type: "Procure";
  version: 1;
  table_data: (string | null)[][][];
  meta_data: Record<string, string>;
};
