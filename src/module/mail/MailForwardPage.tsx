import { ProColumns, ProTable } from "@ant-design/pro-components";
import { getAllMails, MailRequestParams, MailResponse } from "./mailService";
import { ExpandedRowRender } from "rc-table/lib/interface";
import { Attachment } from "./Attachment";
import { useEffect, useState } from "react";
import { Button, Tag } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import replaceCidImages from "./replaceCidImages";
import { SalerWithTags } from "../saler/Saler";
import { getAllSalers } from "../saler/salerService";
import SelectForwardToSaler from "./SelectForwardToSaler";
import styled from "styled-components";

type DataSourceType = MailResponse["data"][0];

const EmailContentDisplay: React.FC<{ record: DataSourceType }> = ({
  record,
}) => {
  const [show, setShow] = useState(false);
  return (
    <div style={{ padding: "12px 40px 0 40px" }}>
      <div
        style={{
          color: "rgba(0,0,0,0.88)",
          fontWeight: 600,
          marginBottom: 12,
        }}
      >
        正文
        {!show && (
          <Button type="link" onClick={() => setShow(true)}>
            点击展开
            <ArrowDownOutlined />
          </Button>
        )}
        {show && (
          <Button type="link" onClick={() => setShow(false)}>
            点击收起
            <ArrowUpOutlined />
          </Button>
        )}
      </div>
      {show &&
        (record.content_html ? (
          <iframe
            srcDoc={replaceCidImages(record.content_html)}
            style={{
              width: "100%",
              height: "60vh",
              border: "1px solid rgba(0,0,0,0.35)",
              borderRadius: 6,
              backgroundColor: "white",
            }}
            sandbox="allow-same-origin"
            title="邮件内容"
          />
        ) : (
          <div
            style={{
              width: "100%",
              maxHeight: "60vh",
              border: "1px solid rgba(0,0,0,0.35)",
              borderRadius: 6,
              backgroundColor: "white",
              padding: 12,
              overflowY: "auto",
            }}
          >
            {record.content_text.split("\n").map((text, index) => (
              <div key={index}>
                {text}
                <br />
              </div>
            ))}
          </div>
        ))}
    </div>
  );
};

const StyledProTable = styled(ProTable<Attachment>)`
  .ant-table-wrapper {
    overflow-x: hidden;
  }
`;

const expandedRowRender: ExpandedRowRender<DataSourceType> = (record) => {
  const datasource = record.attachments.filter(
    (x) => x.content_disposition_type === "attachment"
  );

  const columns: ProColumns<Attachment>[] = [
    {
      title: "附件名称",
      dataIndex: "original_filename",
    },
    {
      title: "大小",
      dataIndex: "file_size",
      render: (value) => {
        if (typeof value !== "number") return "未知";
        return value < 1024
          ? `${value}B`
          : value < 1024 * 1024
          ? `${(value / 1024).toFixed(2)}K`
          : `${(value / 1024 / 1024).toFixed(2)}M`;
      },
    },
    {
      title: "操作",
      render: (_dom, entity) => [
        <a
          key="preview"
          href={`${
            window.location.href.startsWith("http://localhost")
              ? "http://127.0.0.1:8000/api"
              : "http://192.168.100.246:8000/api"
          }/email-attachments/${entity.id}`}
          target="_blank"
        >
          查看
        </a>,
      ],
    },
  ];

  return (
    <div>
      {datasource.length !== 0 && (
        <div style={{ padding: "12px 48px 12px 0" }}>
          <StyledProTable
            rowKey="id"
            size="small"
            columns={columns}
            headerTitle={false}
            search={false}
            options={false}
            pagination={false}
            dataSource={datasource}
            bordered
          />
        </div>
      )}
      <EmailContentDisplay record={record} />
    </div>
  );
};

const RFQ_DISPLAY_COLOR: { [key: string]: string } = {
  ShipServ: "#69e4dd",
  询价: "blue",
};

const MailForwardPage = () => {
  const [allSalers, setAllSalers] = useState<SalerWithTags[] | null>(null);
  const reloadAllSalers = async () => {
    setAllSalers(null);
    setAllSalers((await getAllSalers()).data);
  };
  useEffect(() => {
    reloadAllSalers();
  }, []);

  const columns: ProColumns<DataSourceType>[] = [
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
      hideInSearch: true,
    },
    {
      title: "发件人",
      dataIndex: "sender",
      hideInSearch: true,
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
            to_address={entity.forwards[0]?.to_addresses[0]}
          />
        ),
      hideInSearch: true,
    },
  ];

  return (
    <ProTable<DataSourceType>
      rowKey="id"
      columns={columns}
      request={async (_params) => {
        const params = _params as MailRequestParams;
        const response = (await getAllMails(params)).data;
        return { data: response.data, total: response.total, success: true };
      }}
      expandable={{ expandedRowRender }}
      bordered
    />
  );
};

export default MailForwardPage;
