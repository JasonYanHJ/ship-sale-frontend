import {
  EditableProTable,
  ProColumns,
  ProTable,
  ProTableProps,
} from "@ant-design/pro-components";
import { MailRequestParams, MailResponse } from "./mailService";
import { Attachment } from "./Attachment";
import React, { useEffect, useState } from "react";
import { Button, Space, Tag } from "antd";
import { ArrowDownOutlined, ArrowUpOutlined } from "@ant-design/icons";
import replaceCidImages from "./replaceCidImages";
import styled from "styled-components";
import { ApiResponse } from "../../service/api-request/ApiResponse";
import useResizeObserver from "use-resize-observer";
import { getAllTags } from "../tag/tagService";
import useSWR, { mutate } from "swr";
import { apiRequest, withMessage } from "../../service/api-request/apiRequest";

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

type AttachmentTableDatasource = Omit<Attachment, "tags"> & { tags: string[] };
const StyledProTable = styled(EditableProTable<AttachmentTableDatasource>)`
  .ant-table-container {
    overflow-x: hidden;
  }
`;

const AttachmentTable = ({ attachments }: { attachments: Attachment[] }) => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const { data: tags, mutate } = useSWR(
    "/tags",
    async () => (await getAllTags()).data
  );
  const [datasource, setDatasource] = useState<
    readonly AttachmentTableDatasource[]
  >([]);
  useEffect(() => {
    setDatasource(
      attachments
        .filter((x) => x.content_disposition_type === "attachment")
        .map((a) => ({ ...a, tags: a.tags.map((t) => t.name) }))
    );
  }, [attachments]);

  const columns: ProColumns<AttachmentTableDatasource>[] = [
    {
      title: "附件名称",
      dataIndex: "original_filename",
      editable: false,
    },
    {
      title: "标签",
      dataIndex: "tags",
      valueType: "select",
      render: (_dom, entity) => (
        <Space wrap>
          {entity.tags.map((t, i) => (
            <Tag key={i}>{t}</Tag>
          ))}
        </Space>
      ),
      fieldProps: {
        mode: "tags",
        options: tags?.map((t) => ({ value: t.name, label: t.name })),
      },
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
      editable: false,
    },
    {
      title: "操作",
      valueType: "option",
      render: (_dom, entity, _index, action) => [
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
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(entity.id);
          }}
        >
          设置标签
        </a>,
      ],
    },
  ];
  return (
    datasource.length > 0 && (
      <div style={{ padding: "12px 48px 12px 0" }}>
        <StyledProTable
          rowKey="id"
          size="small"
          columns={columns}
          headerTitle={false}
          search={false}
          options={false}
          pagination={false}
          value={datasource}
          onChange={setDatasource}
          bordered
          recordCreatorProps={false}
          editable={{
            editableKeys,
            onChange: setEditableRowKeys,
            actionRender: (_row, _config, defaultDoms) => {
              return [defaultDoms.save, defaultDoms.cancel];
            },
            onSave: async (rowKey, data) => {
              await withMessage(
                apiRequest(`/email-attachments/sync-tags/${rowKey}`, {
                  tag_names: data.tags,
                })
              );
              mutate();
            },
          }}
        />
      </div>
    )
  );
};

const ANTD_TABLE_CELL_PADDING = 8;
const ANTD_TABLE_CELL_RIGHT_BORDER = 1;
function expandedRowRender(
  record: MailTableDataSourceType,
  containerWidth: number | undefined
) {
  return (
    <div
      style={{
        width: containerWidth
          ? containerWidth -
            2 * ANTD_TABLE_CELL_PADDING -
            ANTD_TABLE_CELL_RIGHT_BORDER
          : undefined,
        position: "sticky",
        left: ANTD_TABLE_CELL_PADDING,
      }}
    >
      <AttachmentTable attachments={record.attachments} />
      <EmailContentDisplay record={record} />
    </div>
  );
}

const MailTable = ({
  columns,
  mailRequest,
  ...props
}: {
  columns: ProColumns<MailTableDataSourceType>[];
  mailRequest: (
    params: MailRequestParams
  ) => Promise<ApiResponse<MailResponse>>;
} & ProTableProps<MailTableDataSourceType, MailRequestParams>) => {
  const { width: containerWidth } = useResizeObserver<HTMLDivElement>({
    ref: document.querySelector(
      ".mail-table .ant-table-container"
    ) as HTMLDivElement,
    box: "content-box",
  });

  return (
    <ProTable<MailTableDataSourceType, MailRequestParams>
      className="mail-table"
      rowKey="id"
      columns={columns}
      request={async (params) => {
        mutate("/tags");
        const response = (await mailRequest(params)).data;
        return { data: response.data, total: response.total, success: true };
      }}
      expandable={{
        expandedRowRender: (record) =>
          expandedRowRender(record, containerWidth),
      }}
      bordered
      {...props}
    />
  );
};

export default MailTable;
