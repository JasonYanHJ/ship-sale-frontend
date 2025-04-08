export type Mail = {
  id: string;
  received_at: string;
  created_at: string;
  updated_at: string;
  extracted_info: ExtractedInfo;
};

export type ExtractedInfo = {
  pdf: string;
  subject: string;
  equipment_section_name: string | null;
  descriptions: string[];
};
