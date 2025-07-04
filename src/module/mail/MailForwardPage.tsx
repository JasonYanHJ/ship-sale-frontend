import { ProColumns } from "@ant-design/pro-components";
import { useEffect, useState } from "react";
import { Space, Tag } from "antd";
import { SalerWithTags } from "../saler/Saler";
import { getAllSalers } from "../saler/salerService";
import SelectForwardToSaler from "./SelectForwardToSaler";
import MailTable, { MailTableDataSourceType } from "./MailTable";
import { RFQ_DISPLAY_COLOR } from "./Email";
import { getAllMailsByDispatcher } from "./mailService";

const MailForwardPage = () => {
  const [allSalers, setAllSalers] = useState<SalerWithTags[] | null>(null);
  const reloadAllSalers = async () => {
    setAllSalers(null);
    setAllSalers((await getAllSalers()).data);
  };
  useEffect(() => {
    reloadAllSalers();
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
      minWidth: 200,
      render: (subject) => (
        <div style={{ wordBreak: "break-all" }}>{subject}</div>
      ),
    },
    {
      title: "发件人",
      dataIndex: "sender",
    },
    {
      title: "收件人",
      dataIndex: "recipients",
      render(_dom, entity) {
        return (
          <Space direction="vertical">
            {entity.recipients?.map((email) => (
              <span>{email}</span>
            ))}
          </Space>
        );
      },
    },
    {
      title: "抄送",
      dataIndex: "cc",
      render(_dom, entity) {
        return (
          <Space direction="vertical">
            {entity.cc?.map((email) => (
              <span>{email}</span>
            ))}
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
            salers={allSalers}
            emailId={entity.id}
            forward={entity.forwards[0]}
          />
        ),
      hideInSearch: true,
    },
  ];
  return <MailTable columns={columns} mailRequest={getAllMailsByDispatcher} />;
};

export default MailForwardPage;
