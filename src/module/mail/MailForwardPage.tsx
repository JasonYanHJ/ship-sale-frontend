import { ProColumns, ProTable } from "@ant-design/pro-components";
import { EmailWithAttachments } from "./Email";
import { getAllMails } from "./mailService";
import { ExpandedRowRender } from "rc-table/lib/interface";
import { Attachment } from "./Attachment";
import { useState } from "react";
import { Button } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import replaceCidImages from "./replaceCidImages";

type DataSourceType = EmailWithAttachments;

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
          <ProTable<Attachment>
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

const MailForwardPage = () => {
  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "主题",
      dataIndex: "subject",
    },
    {
      title: "发件人",
      dataIndex: "sender",
    },
    {
      title: "发送时间",
      dataIndex: "date_sent",
    },
  ];

  return (
    <ProTable<DataSourceType>
      rowKey="id"
      columns={columns}
      request={async () => {
        const mails = (await getAllMails()).data;
        return { data: mails, total: mails.length, success: true };
      }}
      expandable={{ expandedRowRender }}
      search={false}
      bordered
    />
  );
};

export default MailForwardPage;
