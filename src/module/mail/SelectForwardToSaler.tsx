import { Button, Flex, message, Select, Space, Tag, Tooltip } from "antd";
import { SalerWithTags } from "../saler/Saler";
import { useMemo, useState } from "react";
import { mailApiRequest } from "../../service/api-request/apiRequest";

function SelectForwardToSaler({
  salers,
  to_address,
  emailId,
}: {
  salers: SalerWithTags[];
  to_address: string | undefined;
  emailId: number;
}) {
  const [toAddress, setToAddress] = useState<string | undefined>(to_address);
  const [loading, setLoading] = useState(false);
  const [reforwarding, setReforwarding] = useState(false);
  const [forwaded, setForwaded] = useState<string | undefined>(to_address);

  const options = useMemo(
    () =>
      salers.map((s) => ({
        label: (
          <Tooltip
            title={
              <Flex vertical gap={12} style={{ padding: 12, color: "black" }}>
                <div>{s.email}</div>
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
      })),
    [salers]
  );

  const handleForward = () => {
    setLoading(true);
    mailApiRequest(`/emails/${emailId}/forward`, { to_addresses: [toAddress] })
      .then(() => {
        message.success("转发成功");
        setForwaded(toAddress);
        setReforwarding(false);
      })
      .catch(() => {
        message.error("转发失败");
      })
      .finally(() => setLoading(false));
  };

  return forwaded && !reforwarding ? (
    <Flex align="center" justify="space-between">
      <span>已转发给: {salers.find((s) => s.email === forwaded)?.name}</span>
      <Button type="link" onClick={() => setReforwarding(true)}>
        重新转发
      </Button>
    </Flex>
  ) : (
    <Space>
      <Select
        showSearch
        value={toAddress}
        onChange={(v) => setToAddress(v)}
        style={{ width: 160 }}
        options={options}
      />
      <Space direction="vertical">
        <Button
          style={{ width: "4rem" }}
          type="link"
          size="small"
          loading={loading}
          disabled={!toAddress}
          onClick={handleForward}
        >
          转发
        </Button>
        {forwaded && (
          <Button
            style={{ width: "4rem" }}
            type="link"
            size="small"
            onClick={() => setReforwarding(false)}
          >
            取消
          </Button>
        )}
      </Space>
    </Space>
  );
}

export default SelectForwardToSaler;
