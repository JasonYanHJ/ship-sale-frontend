import { Tag } from "../tag/Tag";

export type Saler = {
  id: number;
  name: string;
  email: string;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type SalerWithTags = {
  tags: Tag[];
} & Saler;
