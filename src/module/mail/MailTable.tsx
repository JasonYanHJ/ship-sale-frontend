import { ProColumns, ProTable } from "@ant-design/pro-components";
import { MailRequestParams, MailResponse } from "./mailService";
import { ExpandedRowRender } from "rc-table/lib/interface";
import { Attachment } from "./Attachment";
import { useState } from "react";
import { Button } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import replaceCidImages from "./replaceCidImages";
import styled from "styled-components";
import { ApiResponse } from "../../service/api-request/ApiResponse";

export type MailTableDataSourceType = MailResponse["data"][0];

const EmailContentDisplay: React.FC<{ record: MailTableDataSourceType }> = ({
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

const expandedRowRender: ExpandedRowRender<MailTableDataSourceType> = (
  record
) => {
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

const MailTable = ({
  columns,
  mailRequest,
}: {
  columns: ProColumns<MailTableDataSourceType>[];
  mailRequest: (
    params: MailRequestParams
  ) => Promise<ApiResponse<MailResponse>>;
}) => {
  return (
    <ProTable<MailTableDataSourceType>
      rowKey="id"
      columns={columns}
      request={async (_params) => {
        const params = _params as MailRequestParams;
        const response = (await mailRequest(params)).data;
        return { data: response.data, total: response.total, success: true };
      }}
      expandable={{ expandedRowRender }}
      bordered
    />
  );
};

export default MailTable;
