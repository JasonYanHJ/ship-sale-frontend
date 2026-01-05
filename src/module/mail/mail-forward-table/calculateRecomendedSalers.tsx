import { SalerWithTags } from "../../saler/Saler";
import { Tag } from "../../tag/Tag";
import {
  BsmExtra,
  ProcureExtra,
  ProdigyExtra,
  ShipServExtra,
  VshipExtra,
} from "../type/Attachment";
import { Email, WithAttachments } from "../type/Email";

function calculateRecomendedSalers(
  email: WithAttachments<Email>,
  salers: SalerWithTags[]
): (SalerWithTags & { matchedTags: Tag[] })[] {
  if (email.type !== "RFQ") return [];

  if (
    email.from_system === "ShipServ" ||
    email.from_system === "Procure" ||
    email.from_system === "Prodigy" ||
    email.from_system === "Vship" ||
    email.from_system === "BSM"
  ) {
    const extraText = email.attachments
      .filter((m) => !!m.extra)
      .map(
        (m) =>
          m.extra as
            | ShipServExtra
            | ProcureExtra
            | ProdigyExtra
            | VshipExtra
            | BsmExtra
      )
      .map(
        (extra) =>
          JSON.stringify(extra.meta_data) +
          JSON.stringify(
            // 避免key影响推荐判断
            extra.type === "Prodigy" ||
              extra.type === "Vship" ||
              extra.type === "BSM"
              ? extra.table_data.map((d) => Object.values(d))
              : extra.table_data
          )
      )
      .map((text) => text.replace(/\\n/g, " "))
      .join()
      .toLowerCase();
    return (
      salers
        .flatMap((s) => {
          const matchedTags = s.tags.filter((t) =>
            extraText.includes(t.name.toLowerCase())
          );
          if (matchedTags.length === 0) return [];
          return { ...s, matchedTags };
        })
        // 物料组（Duke组）的邮件，根据邮件主题中的客户名，直接转发给一线销售，而不是全部转发给组长duke
        .map((s) => {
          // 只特殊处理Duke的情况，其余情况原样返回
          if (s.name !== "Duke Wang") return s;

          // 对于推荐给Duke的邮件，根据物料组中一线销售的客户负责名单，如果符合，则将Duke改为对应一线销售
          const responsibilities: Record<
            string,
            ["subject" | "from_system", string][]
          > = {
            "Colin Zhu": [
              ["subject", "Columbia"],
              ["subject", "OSM"],
              ["subject", "WSM global service"],
              ["subject", "Synergy Denmark A/S"],
              ["subject", "Wallem"],
              ["subject", "Thome Ship"],
            ],
            "Bella Chen": [
              ["subject", "Fleet"],
              ["subject", "FML"],
              ["subject", "Teekay"],
              ["subject", "Scorpio"],
              ["from_system", "Procure"],
            ],
            "Lorna Wang": [
              ["subject", "Anglo-eastern"],
              ["subject", "Seaspan"],
              ["subject", "Optimum"],
            ],
          };

          for (const name in responsibilities) {
            if (
              responsibilities[name].some((rule) =>
                email[rule[0]]?.toLowerCase().includes(rule[1].toLowerCase())
              )
            ) {
              return {
                ...salers.find((s) => s.name === name)!,
                matchedTags: s.matchedTags,
              };
            }
          }
          return s;
        })
        .sort((a, b) => b.matchedTags.length - a.matchedTags.length)
    );
  }

  return [];
}

export default calculateRecomendedSalers;
