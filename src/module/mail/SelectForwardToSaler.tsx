import { Button, Flex, message, Select, Space, Tag, Tooltip } from "antd";
import { SalerWithTags } from "../saler/Saler";
import { useCallback, useEffect, useMemo, useState } from "react";
import { mailApiRequest } from "../../service/api-request/apiRequest";
import { Forward } from "./Forward";
import useAuth from "../auth/useAuth";
import { User } from "../auth/User";
import useSalerSelectOptions from "./useSalerSelectOptions";
import { difference, union } from "lodash";
import { MailTableDataSourceType } from "./MailTable";
import calculateRecomendedSalers from "./calculateRecomendedSalers";

function SelectForwardToSaler({
  salers,
  forward,
  emailId,
  defaultCcAddresses,
  email,
}: {
  salers: SalerWithTags[];
  forward: Forward | undefined;
  emailId: number;
  defaultCcAddresses: string[];
  email: MailTableDataSourceType;
}) {
  const auth = useAuth();
  const user = auth.user as User;

  const [loading, setLoading] = useState(false);
  const [reforwarding, setReforwarding] = useState(false);

  const [toAddresses, setToAddresses] = useState<string[]>(
    forward?.to_addresses ?? []
  );
  const [forwaded, setForwaded] = useState<string[] | undefined>(
    forward?.to_addresses
  );

  const [ccAddresses, setCcAddresses] = useState<string[]>(
    forward?.cc_addresses ?? []
  );
  const [copied, setCopied] = useState<string[]>(forward?.cc_addresses ?? []);

  // 没有转发记录时，抄送人受全局默认抄送人影响
  useEffect(() => {
    if (forwaded) return;
    setCcAddresses(defaultCcAddresses);
  }, [defaultCcAddresses, forwaded]);

  // 当选择的收件人有组长时，自动将组长添加到抄送
  const handleToAddressesChange = useCallback(
    (v: string[]) => {
      setToAddresses(v);

      const added = difference(v, toAddresses);
      const removed = difference(toAddresses, v);
      const [leadersToAdd, leadersToRemove] = [added, removed].map((emails) =>
        emails
          .map((email) => salers.find((s) => s.email === email)!)
          .filter((s) => s.leader)
          .map((s) => s.leader!.email)
      );
      setCcAddresses((cc) =>
        union(difference(cc, leadersToRemove), leadersToAdd)
      );
    },
    [salers, toAddresses]
  );

  const recomendedSalers = useMemo(
    () => calculateRecomendedSalers(email, salers),
    [email, salers]
  );
  const otherSalers = salers.filter((s) =>
    recomendedSalers.every((rs) => rs.id !== s.id)
  );

  const recomendedSalerOptions = useMemo(
    () =>
      recomendedSalers.map((s) => ({
        label: (
          <Tooltip
            title={
              <Flex vertical gap={12} style={{ padding: 12, color: "black" }}>
                <div>{s.email}</div>
                <Space wrap>
                  {s.tags.map((t) => (
                    <Tag
                      key={t.id}
                      color={
                        s.matchedTags.some((mt) => mt.id === t.id)
                          ? "blue"
                          : undefined
                      }
                      style={{ marginInlineEnd: 0 }}
                    >
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
    [recomendedSalers]
  );
  const { options: otherSalerOptions } = useSalerSelectOptions(otherSalers);

  const options = useMemo(
    () => [
      {
        label: "系统推荐",
        options: recomendedSalerOptions,
      },
      {
        label: "其他",
        options: otherSalerOptions,
      },
    ],
    [otherSalerOptions, recomendedSalerOptions]
  );

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
        {copied.length > 0 && (
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
          onChange={handleToAddressesChange}
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
          disabled={toAddresses.length === 0}
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
