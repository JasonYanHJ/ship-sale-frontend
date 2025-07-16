import { Tag } from "../tag/Tag";

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
};
