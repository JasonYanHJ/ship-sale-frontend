import { Button, Flex, message, Select, Space } from "antd";
import { SalerWithTags } from "../saler/Saler";
import { useEffect, useState } from "react";
import { mailApiRequest } from "../../service/api-request/apiRequest";
import { Forward } from "./Forward";
import useAuth from "../auth/useAuth";
import { User } from "../auth/User";
import useSalerSelectOptions from "./useSalerSelectOptions";

function SelectForwardToSaler({
  salers,
  forward,
  emailId,
  defaultCcAddresses,
}: {
  salers: SalerWithTags[];
  forward: Forward | undefined;
  emailId: number;
  defaultCcAddresses: string[];
}) {
  const auth = useAuth();
  const user = auth.user as User;

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

  // 没有转发记录时，抄送人受全局默认抄送人影响
  useEffect(() => {
    if (forwaded) return;
    setCcAddresses(defaultCcAddresses);
  }, [defaultCcAddresses, forwaded]);

  const { options } = useSalerSelectOptions(salers);

  const handleForward = () => {
    setLoading(true);
    mailApiRequest(`/emails/${emailId}/forward`, {
      to_addresses: toAddresses,
      cc_addresses: ccAddresses,
      reply_to: [user.email],
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
    <Flex align="center" justify="space-between" style={{ minWidth: 224 }}>
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
          style={{ width: "100%", minWidth: 160 }}
          options={options}
        />
        <Select
          placeholder="抄送"
          mode="tags"
          showSearch
          value={ccAddresses}
          onChange={(v) => setCcAddresses(v)}
          style={{ width: "100%", minWidth: 160 }}
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
