import { useEffect, useRef, useState } from "react";
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from "@ant-design/pro-components";
import {
  deleteSaler,
  getAllSalers,
  storeSaler,
  updateSaler,
} from "./salerService";
import { withMessage } from "../../service/api-request/apiRequest";
import { Saler } from "./Saler";
import { Popconfirm, Space, Tag, Typography } from "antd";
import { getAllTags } from "../tag/tagService";
import "./SalerManagementPage.css";

type DataSourceType = Omit<Saler, "created_at" | "updated_at"> & {
  tag_names: string[];
};

const SalerManagementPage = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const actionRef = useRef<ActionType>();

  const [allTags, setAllTags] = useState<string[] | null>(null);
  const reloadAllTags = async () => {
    setAllTags(null);
    const tags = (await getAllTags()).data;
    setAllTags(tags.map((t) => t.name));
  };
  useEffect(() => {
    reloadAllTags();
  }, []);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "销售人员姓名",
      dataIndex: "name",
    },
    {
      title: "邮箱",
      dataIndex: "email",
    },
    {
      title: "标签",
      dataIndex: "tag_names",
      valueType: "select",
      width: "25%",
      fieldProps: () => ({
        mode: "tags",
        loading: allTags === null,
        options: allTags,
        allowClear: false,
      }),
      render: (_, entity) => (
        <Space wrap>
          {entity.tag_names.map((name) => (
            <Tag key={name}>{name}</Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "职责描述",
      dataIndex: "description",
      valueType: "textarea",
      width: "25%",
      render: (_, entity) => (
        <Typography.Paragraph
          style={{ marginBottom: 0 }}
          ellipsis={{ rows: 3, expandable: "collapsible" }}
        >
          {entity.description}
        </Typography.Paragraph>
      ),
    },
    {
      title: "操作",
      valueType: "option",
      width: 120,
      render: (_text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action?.startEditable?.(record.id);
          }}
        >
          编辑
        </a>,
        <Popconfirm
          key="delete"
          title="确认删除？"
          onConfirm={() => {
            withMessage(deleteSaler(record.id)).then(() => action?.reload?.());
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <div style={{ position: "relative" }}>
      <EditableProTable<DataSourceType>
        tableClassName="saler-management-table"
        rowKey="id"
        columns={columns}
        actionRef={actionRef}
        request={async () => {
          const salers = (await getAllSalers()).data.map((saler) => ({
            ...saler,
            tag_names: saler.tags.map((tag) => tag.name),
          }));
          return { data: salers, total: salers.length, success: true };
        }}
        editable={{
          type: "single",
          editableKeys,
          onSave: async (rowKey, data) =>
            (rowKey as number) < 0
              ? withMessage(storeSaler(data)).then(() =>
                  setTimeout(() => {
                    actionRef.current?.reload();
                    reloadAllTags();
                  })
                )
              : withMessage(updateSaler(rowKey as number, data)).then(() =>
                  setTimeout(() => {
                    actionRef.current?.reload();
                    reloadAllTags();
                  })
                ),
          onChange: setEditableRowKeys,
          actionRender: (_row, _config, defaultDoms) => {
            return [defaultDoms.save, defaultDoms.cancel];
          },
        }}
        recordCreatorProps={{
          position: "bottom",
          creatorButtonText: "添加新的销售人员",
          record: () => ({
            id: Math.floor(-99999 * Math.random()),
            name: "姓名",
            email: "abc@example.com",
            description: "",
            tag_names: [],
          }),
        }}
        bordered
      />
    </div>
  );
};

export default SalerManagementPage;
