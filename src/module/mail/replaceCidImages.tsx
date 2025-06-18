import { API_PREFIX } from "../../service/api-request/apiRequest";

export default function replaceCidImages(htmlContent: string) {
  return htmlContent.replace(/src="cid:([^"]+)"/g, (_match, cid) => {
    const imageUrl = `${API_PREFIX}/email-attachments/cids/${cid}`;
    return `src="${imageUrl}"`;
  });
}
