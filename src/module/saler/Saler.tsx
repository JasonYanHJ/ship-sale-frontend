import { Tag } from "../tag/Tag";

type BaseSaler = {
  id: number;
  name: string;
  email: string;
  leader_id: number | null;
  description: string | null;
  created_at: string;
  updated_at: string;
};

export type Saler = {
  leader: BaseSaler | null;
} & BaseSaler;

export type SalerWithTags = {
  tags: Tag[];
} & Saler;
