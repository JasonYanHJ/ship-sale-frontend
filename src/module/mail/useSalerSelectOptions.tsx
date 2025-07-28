import { useMemo } from "react";
import { SalerWithTags } from "../saler/Saler";
import { Flex, Space, Tag, Tooltip } from "antd";

export default function useSalerSelectOptions(salers: SalerWithTags[] | null) {
  const options = useMemo(
    () =>
      salers
        ? salers.map((s) => ({
            label: (
              <Tooltip
                title={
                  <Flex
                    vertical
                    gap={12}
                    style={{ padding: 12, color: "black" }}
                  >
                    <div>{s.email}</div>
                    <div style={{ color: "grey" }}>
                      组长: {s.leader?.name ?? "-"}
                    </div>
                    <Space wrap>
                      {s.tags.map((t) => (
                        <Tag key={t.id} style={{ marginInlineEnd: 0 }}>
                          {t.name}
                        </Tag>
                      ))}
                    </Space>
                    {s.description && (
                      <div style={{ color: "grey" }}>{s.description}</div>
                    )}
                  </Flex>
                }
                color="white"
                placement="left"
              >
                <div>{s.name}</div>
              </Tooltip>
            ),
            value: s.email,
          }))
        : [],
    [salers]
  );

  return { options };
}
