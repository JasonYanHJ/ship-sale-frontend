import { EditableProTable, ProColumns } from "@ant-design/pro-components";
import { Space, Tag } from "antd";
import { useState, useEffect } from "react";
import styled from "styled-components";
import useSWR from "swr";
import {
  withMessage,
  apiRequest,
} from "../../../service/api-request/apiRequest";
import { getAllTags } from "../../tag/tagService";
import {
  Attachment,
  BsmExtra,
  ProcureExtra,
  ProdigyExtra,
  ShipServExtra,
  VshipExtra,
} from "../type/Attachment";
import ShipServExtraDescription from "./attachment-extra/shipserv/ShipServExtraDescription";
import ShipServExtraTables from "./attachment-extra/shipserv/ShipServExtraTables";
import ProcureExtraDescription from "./attachment-extra/procure/ProcureExtraDescription";
import ProcureExtraTables from "./attachment-extra/procure/ProcureExtraTables";
import ProdigyExtraDescription from "./attachment-extra/prodigy/ProdigyExtraDescription";
import ProdigyExtraTable from "./attachment-extra/prodigy/ProdigyExtraTable";
import VshipExtraDescription from "./attachment-extra/vship/VshipExtraDescription";
import VshipExtraTable from "./attachment-extra/vship/VshipExtraTable";
import BsmExtraDescription from "./attachment-extra/bsm/BsmExtraDescription";
import BsmExtraTable from "./attachment-extra/bsm/BsmExtraTable";

type AttachmentTableDatasource = Omit<Attachment, "tags"> & { tags: string[] };
const StyledProTable = styled(EditableProTable<AttachmentTableDatasource>)`
  .ant-table-container {
    overflow-x: hidden;
    table {
      max-width: 100%;
    }
  }
`;

function expandedRowRender(record: AttachmentTableDatasource) {
  return (
    <div>
      {record.extra?.type === "ShipServ" && (
        <>
          <ShipServExtraDescription extra={record.extra as ShipServExtra} />
          <ShipServExtraTables extra={record.extra as ShipServExtra} />
        </>
      )}
      {record.extra?.type === "Procure" && (
        <>
          <ProcureExtraDescription extra={record.extra as ProcureExtra} />
          <ProcureExtraTables extra={record.extra as ProcureExtra} />
        </>
      )}
      {record.extra?.type === "Prodigy" && (
        <>
          <ProdigyExtraDescription extra={record.extra as ProdigyExtra} />
          <ProdigyExtraTable extra={record.extra as ProdigyExtra} />
        </>
      )}
      {record.extra?.type === "Vship" && (
        <>
          <VshipExtraDescription extra={record.extra as VshipExtra} />
          <VshipExtraTable extra={record.extra as VshipExtra} />
        </>
      )}
      {record.extra?.type === "BSM" && (
        <>
          <BsmExtraDescription extra={record.extra as BsmExtra} />
          <BsmExtraTable extra={record.extra as BsmExtra} />
        </>
      )}
    </div>
  );
}

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
          expandable={{
            defaultExpandAllRows: true,
            rowExpandable: (record) => !!record.extra,
            expandedRowRender: (record) => expandedRowRender(record),
          }}
        />
      </div>
    )
  );
};

export default AttachmentTable;
