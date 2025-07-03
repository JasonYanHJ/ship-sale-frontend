import { Button, Flex, message, Select, Space, Tag, Tooltip } from "antd";
import { SalerWithTags } from "../saler/Saler";
import { useMemo, useState } from "react";
import { mailApiRequest } from "../../service/api-request/apiRequest";
import { Forward } from "./Forward";

function SelectForwardToSaler({
  salers,
  forward,
  emailId,
}: {
  salers: SalerWithTags[];
  forward: Forward | undefined;
  emailId: number;
}) {
  const [loading, setLoading] = useState(false);
  const [reforwarding, setReforwarding] = useState(false);

  const [toAddresses, setToAddresses] = useState<string[] | undefined>(
    forward?.to_addresses
  );
  const [forwaded, setForwaded] = useState<string[] | undefined>(
    forward?.to_addresses
  );

  const [ccAddresses, setCcAddresses] = useState<string[] | undefined | null>(
    forward?.cc_addresses
  );
  const [copied, setCopied] = useState<string[] | undefined | null>(
    forward?.cc_addresses
  );

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
    mailApiRequest(`/emails/${emailId}/forward`, {
      to_addresses: toAddresses,
      cc_addresses: ccAddresses,
    })
      .then(() => {
        message.success("转发成功");
        setForwaded(toAddresses);
        setCopied(ccAddresses);
        setReforwarding(false);
      })
      .catch(() => {
        message.error("转发失败");
      })
      .finally(() => setLoading(false));
  };

  return forwaded && !reforwarding ? (
    <Flex align="center" justify="space-between">
      <Space direction="vertical">
        <span>
          收件人:
          {forwaded
            .map((f) => salers.find((s) => s.email === f)?.name ?? f)
            .join(",")}
        </span>
        {copied && (
          <span>
            抄送:
            {copied
              .map((f) => salers.find((s) => s.email === f)?.name ?? f)
              .join(",")}
          </span>
        )}
      </Space>
      <Button type="link" onClick={() => setReforwarding(true)}>
        重新转发
      </Button>
    </Flex>
  ) : (
    <Flex align="center" justify="space-between">
      <Space direction="vertical" style={{ width: "100%" }}>
        <Select
          placeholder="收件人"
          mode="multiple"
          showSearch
          value={toAddresses}
          onChange={(v) => setToAddresses(v)}
          style={{ width: "100%" }}
          options={options}
        />
        <Select
          placeholder="抄送"
          mode="tags"
          showSearch
          value={ccAddresses}
          onChange={(v) => setCcAddresses(v)}
          style={{ width: "100%" }}
          options={options}
        />
      </Space>
      <Space direction="vertical">
        <Button
          style={{ width: "4rem" }}
          type="link"
          size="small"
          loading={loading}
          disabled={!toAddresses || toAddresses.length === 0}
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
    </Flex>
  );
}

export default SelectForwardToSaler;
