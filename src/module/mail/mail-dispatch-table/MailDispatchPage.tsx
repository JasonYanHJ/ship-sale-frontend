import { ProColumns } from "@ant-design/pro-components";
import { Space, Tag } from "antd";
import MailTable, {
  MailTableDataSourceType,
} from "../mail-base-table/MailTable";
import { INFO_DISPLAY_COLOR } from "../type/Email";
import { getAllMails } from "../mailService";
import { useCallback, useEffect, useState } from "react";
import { User } from "../../auth/User";
import { apiRequest } from "../../../service/api-request/apiRequest";
import SelectDispatcher from "./SelectDispatcher";

const MailDispatchPage = () => {
  const [allDispatchers, setAllDispatchers] = useState<User[] | null>(null);
  const reloadAllDispatchers = useCallback(async () => {
    apiRequest<User[]>("/users/dispatchers").then((res) =>
      setAllDispatchers(res.data)
    );
  }, []);
  useEffect(() => {
    reloadAllDispatchers();
  }, [reloadAllDispatchers]);

  const columns: ProColumns<MailTableDataSourceType>[] = [
    {
      title: "类型",
      minWidth: 60,
      render(_dom, entity) {
        const typeDisplay =
          entity.type === "RFQ"
            ? "询价"
            : entity.type === "ORDER"
            ? "订单"
            : entity.type === "REMINDER"
            ? "Remind"
            : entity.type === "MESSAGE"
            ? "Message"
            : null;
        return typeDisplay ? (
          <Tag color={INFO_DISPLAY_COLOR[typeDisplay]}>{typeDisplay}</Tag>
        ) : (
          "-"
        );
      },
      key: "type",
      valueType: "select",
      valueEnum: {
        ORDER: "订单",
        RFQ: "询价",
        REMINDER: "Remind",
        MESSAGE: "Message",
        NULL: "其他",
      },
    },
    {
      title: "系统",
      minWidth: 80,
      render(_dom, entity) {
        return entity.from_system ? (
          <Tag color={INFO_DISPLAY_COLOR[entity.from_system]}>
            {entity.from_system}
          </Tag>
        ) : (
          "-"
        );
      },
      key: "from_system",
      valueType: "select",
      valueEnum: {
        ShipServ: "ShipServ",
        Procure: "Procure",
        Prodigy: "Prodigy",
        NULL: "其他",
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
      title: "分配",
      render: (_dom, entity) =>
        allDispatchers && (
          <SelectDispatcher
            key={`${entity.id}-${entity.dispatcher_id}`}
            dispatchers={allDispatchers}
            dispatcher_id={entity.dispatcher_id}
            emailId={entity.id}
          />
        ),
      hideInSearch: true,
      fixed: "right",
    },
    {
      title: "分配状态",
      key: "dispatched",
      hideInTable: true,
      valueType: "select",
      valueEnum: new Map([
        [true, "已分配"],
        [false, "未分配"],
      ]),
    },
    {
      title: "转发状态",
      key: "forwarded",
      hideInTable: true,
      valueType: "select",
      valueEnum: new Map([
        [true, "已转发"],
        [false, "未转发"],
      ]),
    },
  ];
  return (
    <MailTable
      columns={columns}
      mailRequest={(params) => {
        reloadAllDispatchers();
        return getAllMails(params);
      }}
      search={{ collapsed: false }}
    />
  );
};

export default MailDispatchPage;
