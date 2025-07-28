import { SalerWithTags } from "../../saler/Saler";
import { Tag } from "../../tag/Tag";
import { ShipServExtra } from "../type/Attachment";
import { Email, WithAttachments } from "../type/Email";

function calculateRecomendedSalers(
  email: WithAttachments<Email>,
  salers: SalerWithTags[]
): (SalerWithTags & { matchedTags: Tag[] })[] {
  if (!email.rfq) return [];

  if (email.rfq_type === "ShipServ") {
    const extraText = email.attachments
      .filter((m) => !!m.extra)
      .map((m) => m.extra as ShipServExtra)
      .map(
        (extra) =>
          JSON.stringify(extra.meta_data) + JSON.stringify(extra.table_data)
      )
      .map((text) => text.replace(/\\n/g, " "))
      .join()
      .toLowerCase();
    return salers
      .flatMap((s) => {
        const matchedTags = s.tags.filter((t) =>
          extraText.includes(t.name.toLowerCase())
        );
        if (matchedTags.length === 0) return [];
        return { ...s, matchedTags };
      })
      .sort((a, b) => b.matchedTags.length - a.matchedTags.length);
  }

  return [];
}

export default calculateRecomendedSalers;
