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

export type ProdigyExtra = BaseExtra & {
  type: "Prodigy";
  version: 1;
  table_data: {
    itemDescription: string;
    makerRef: string;
    partNo: string;
    drawingNo: string;
    positionNo: string;
    componentName: string;
    maker: string;
    model: string;
    componentSerialNo: string;
    requestedQty: string;
    requestedUOM: { code: string; name: string };
    offeredQty: string;
    offeredUOM: { code: string; name: string };
  }[];
  meta_data: Record<string, string>;
};

export type VshipExtra = BaseExtra & {
  type: "Vship";
  version: 1;
  table_data: {
    RodLineNo: number;
    Enquired: number;
    UnitType: string;
    PartName: string;
    MakersRef: string;
    DrawingPos: string;
    SparePartNotes: string;
  }[];
  meta_data: Record<string, string>;
};

export type BsmExtra = BaseExtra & {
  type: "BSM";
  version: 1;
  table_data: {
    number: number;
    partNumber: string;
    productCode: string;
    description: string;
    uomName: string;
    quantity: number;
    remarksToVendor: string | null;
    equipmentName: string;
    maker: string;
    modelNumber: string;
    drawingNumber: string;
    serialNumber: string;
  }[];
  meta_data: Record<string, string | null>;
};
