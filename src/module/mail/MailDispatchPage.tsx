import { ProColumns } from "@ant-design/pro-components";
import { Tag } from "antd";
import MailTable, { MailTableDataSourceType } from "./MailTable";
import { RFQ_DISPLAY_COLOR } from "./Email";
import { getAllMails } from "./mailService";
import { useEffect, useState } from "react";
import { User } from "../auth/User";
import { apiRequest } from "../../service/api-request/apiRequest";
import SelectDispatcher from "./SelectDispatcher";

const MailDispatchPage = () => {
  const [allDispatchers, setAllDispatchers] = useState<User[] | null>(null);
  useEffect(() => {
    apiRequest<User[]>("/users/dispatchers").then((res) =>
      setAllDispatchers(res.data)
    );
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
      title: "分配",
      render: (_dom, entity) =>
        allDispatchers && (
          <SelectDispatcher
            dispatchers={allDispatchers}
            dispatcher_id={entity.dispatcher_id}
            emailId={entity.id}
          />
        ),
      hideInSearch: true,
    },
    {
      title: "分配状态",
      key: "dispatched",
      hideInTable: true,
      valueType: "select",
      valueEnum: {
        not_dispatched: "未分配",
        dispatched: "已分配",
      },
      search: {
        transform: (v) => v === "dispatched",
      },
    },
  ];
  return <MailTable columns={columns} mailRequest={getAllMails} />;
};

export default MailDispatchPage;
