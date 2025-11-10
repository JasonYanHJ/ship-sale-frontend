import {
  Button,
  Dropdown,
  Flex,
  message,
  Modal,
  Select,
  Space,
  Tag,
  Tooltip,
} from "antd";
import { SalerWithTags } from "../../saler/Saler";
import { useCallback, useEffect, useMemo, useState } from "react";
import { mailApiRequest } from "../../../service/api-request/apiRequest";
import { Forward } from "../type/Forward";
import useAuth from "../../auth/useAuth";
import { User } from "../../auth/User";
import useSalerSelectOptions from "./useSalerSelectOptions";
import { difference, union } from "lodash";
import { MailTableDataSourceType } from "../mail-base-table/MailTable";
import calculateRecomendedSalers from "./calculateRecomendedSalers";
import { FormOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

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
  // reforwarding指示是否重新显示选择框，correcting用于指示操作是“转发”还是“更正”
  const [reforwarding, setReforwarding] = useState(false);
  const [correcting, setCorrecting] = useState(false);

  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [additionalMessage, setAdditionalMessage] = useState("");

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
                <div style={{ color: "grey" }}>
                  组长: {s.leader?.name ?? "-"}
                </div>
                <Space wrap>
                  {s.matchedTags.map((t) => (
                    <Tag key={t.id} color="blue" style={{ marginInlineEnd: 0 }}>
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

  // 初始化时，收件人自动填充系统推荐的销售人员并抄送对应的组长
  useEffect(() => {
    if (toAddresses.length !== 0) return;

    const emails = recomendedSalers.map((s) => s.email);
    setToAddresses(emails);
    handleToAddressesChange(emails);

    // 只有初始化时执行
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleForward = (additional_message: string | null = null) => {
    setLoading(true);
    return mailApiRequest(`/emails/${emailId}/forward`, {
      to_addresses: toAddresses,
      cc_addresses: ccAddresses,
      reply_to: [user.email],
      additional_message,
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

  const handleCorrect = () => {
    setLoading(true);
    mailApiRequest(`/emails/${emailId}/forward-correct`, {
      to_addresses: toAddresses,
      cc_addresses: ccAddresses,
      reply_to: [user.email],
    })
      .then(() => {
        message.success("更正成功");
        setForwaded(toAddresses);
        setCopied(ccAddresses);
        setReforwarding(false);
        setCorrecting(false);
      })
      .catch(() => {
        message.error("更正失败");
      })
      .finally(() => setLoading(false));
  };

  const handleMoreAction = ({ key }: { key: string }) => {
    switch (key) {
      case "message":
        setIsMessageModalOpen(true);
        break;
    }
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
      <Space direction="vertical">
        <Button type="link" onClick={() => setReforwarding(true)}>
          重新转发
        </Button>
        <Button
          type="link"
          onClick={() => {
            setReforwarding(true);
            setCorrecting(true);
          }}
        >
          更正记录
        </Button>
      </Space>
    </Flex>
  ) : (
    <Flex align="center" justify="space-between">
      <Modal
        title="编辑额外信息"
        open={isMessageModalOpen}
        onCancel={() => setIsMessageModalOpen(false)}
        onOk={() =>
          handleForward(additionalMessage).then(() =>
            setIsMessageModalOpen(false)
          )
        }
        okText="转发"
      >
        <TextArea
          rows={5}
          value={additionalMessage}
          onChange={(e) => setAdditionalMessage(e.target.value)}
        />
      </Modal>
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
        {correcting ? (
          <Button
            style={{ width: "4rem" }}
            type="link"
            size="small"
            loading={loading}
            disabled={toAddresses.length === 0}
            onClick={handleCorrect}
          >
            更正
          </Button>
        ) : (
          <Dropdown.Button
            menu={{
              items: [
                {
                  label: "添加额外文本信息，再转发",
                  key: "message",
                  icon: <FormOutlined />,
                },
              ],
              onClick: handleMoreAction,
            }}
            type="link"
            size="small"
            loading={loading}
            disabled={toAddresses.length === 0 || loading}
            onClick={() => handleForward()}
          >
            转发
          </Dropdown.Button>
        )}

        {forwaded && (
          <Button
            style={{ width: "4rem" }}
            type="link"
            size="small"
            onClick={() => {
              setReforwarding(false);
              setCorrecting(false);
            }}
          >
            取消
          </Button>
        )}
      </Space>
    </Flex>
  );
}

export default SelectForwardToSaler;
