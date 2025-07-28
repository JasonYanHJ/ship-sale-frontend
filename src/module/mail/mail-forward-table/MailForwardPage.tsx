import { ProColumns } from "@ant-design/pro-components";
import { useCallback, useEffect, useState } from "react";
import { Select, Space, Tag } from "antd";
import { SalerWithTags } from "../../saler/Saler";
import { getAllSalers } from "../../saler/salerService";
import SelectForwardToSaler from "./SelectForwardToSaler";
import MailTable, {
  MailTableDataSourceType,
} from "../mail-base-table/MailTable";
import { RFQ_DISPLAY_COLOR } from "../type/Email";
import { getAllMailsByDispatcher } from "../mailService";
import useSalerSelectOptions from "./useSalerSelectOptions";
import useDefaultCcAddresses from "./useDefaultCcAddresses";

const MailForwardPage = () => {
  const [allSalers, setAllSalers] = useState<SalerWithTags[] | null>(null);
  const reloadAllSalers = useCallback(async () => {
    setAllSalers((await getAllSalers()).data);
  }, []);
  useEffect(() => {
    reloadAllSalers();
  }, [reloadAllSalers]);
  const { options } = useSalerSelectOptions(allSalers);
  const [defaultCcAddresses, setDefaultCcAddresses] = useDefaultCcAddresses();

  const [remountKey, setRemountKey] = useState(0);
  const remount = useCallback(() => {
    setRemountKey((key) => key + 1);
  }, []);

  const columns: ProColumns<MailTableDataSourceType>[] = [
    {
      title: "类型",
      minWidth: 80,
      render(_dom, entity) {
        const displayString = entity.rfq_type ?? (entity.rfq ? "询价" : "其他");
        return (
          <Tag color={RFQ_DISPLAY_COLOR[displayString]}>{displayString}</Tag>
        );
      },
      hideInSearch: true,
    },
    {
      title: "类型",
      hideInTable: true,
      key: "rfq_string",
      valueType: "select",
      valueEnum: {
        ShipServ: "ShipServ",
        rfq: "询价",
        no_rfq: "其他",
      },
    },
    {
      title: "主题",
      dataIndex: "subject",
      minWidth: 300,
      render: (subject) => (
        <div
          style={{
            wordBreak: "break-all",
            color: "#255999",
            fontWeight: "bold",
          }}
        >
          {subject}
        </div>
      ),
    },
    {
      title: "发件人",
      dataIndex: "sender",
      minWidth: 220,
      render(dom) {
        return <span style={{ wordBreak: "break-all" }}>{dom}</span>;
      },
    },
    {
      title: "收件人",
      dataIndex: "recipients",
      minWidth: 220,
      render(_dom, entity) {
        return (
          <Space direction="vertical" style={{ wordBreak: "break-all" }}>
            {entity.recipients && entity.recipients.length > 0
              ? entity.recipients?.map((email, i) => (
                  <span key={i}>{email}</span>
                ))
              : "-"}
          </Space>
        );
      },
    },
    {
      title: "抄送",
      dataIndex: "cc",
      minWidth: 220,
      render(_dom, entity) {
        return (
          <Space direction="vertical" style={{ wordBreak: "break-all" }}>
            {entity.cc && entity.cc.length > 0
              ? entity.cc?.map((email, i) => <span key={i}>{email}</span>)
              : "-"}
          </Space>
        );
      },
    },
    {
      title: "发送时间",
      dataIndex: "date_sent",
      minWidth: 100,
      valueType: "dateTime",
      hideInSearch: true,
    },
    {
      title: "发送时间",
      dataIndex: "date_sent",
      valueType: "date",
      hideInTable: true,
    },
    {
      title: "转发",
      render: (_dom, entity) =>
        allSalers && (
          <SelectForwardToSaler
            key={`${remountKey}-${entity.id}-${entity.forwards[0]?.id ?? null}`}
            salers={allSalers}
            emailId={entity.id}
            forward={entity.forwards[0]}
            defaultCcAddresses={defaultCcAddresses}
            email={entity}
          />
        ),
      hideInSearch: true,
      fixed: "right",
    },
  ];

  return (
    <MailTable
      columns={columns}
      mailRequest={async (params) => {
        const result = await getAllMailsByDispatcher(params);
        await reloadAllSalers();

        // 等待数据刷新完成后，再重新挂载SelectForwardToSaler组件
        remount();

        return result;
      }}
      toolBarRender={() => [
        <Space key="default-cc" style={{ marginInlineEnd: 16 }}>
          默认抄送:
          <Select
            mode="tags"
            options={options}
            style={{ minWidth: 160 }}
            placeholder="抄送"
            value={defaultCcAddresses}
            onChange={(v) => setDefaultCcAddresses(v)}
          />
        </Space>,
      ]}
    />
  );
};

export default MailForwardPage;
