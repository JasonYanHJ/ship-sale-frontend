import { useCallback, useEffect, useState } from "react";
import { EditableProTable, ProColumns } from "@ant-design/pro-components";
import {
  deleteSaler,
  getAllSalers,
  storeSaler,
  updateSaler,
} from "./salerService";
import { withMessage } from "../../service/api-request/apiRequest";
import { Saler, SalerWithTags } from "./Saler";
import { Popconfirm, Space, Tag, Typography } from "antd";
import { getAllTags } from "../tag/tagService";
import "./SalerManagementPage.css";

type DataSourceType = Omit<Saler, "created_at" | "updated_at"> & {
  tag_names: string[];
};

const SalerManagementPage = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);

  const [allSalers, setAllSalers] = useState<SalerWithTags[] | null>(null);
  const reloadAllSalers = useCallback(async () => {
    setAllSalers((await getAllSalers()).data);
  }, []);
  useEffect(() => {
    reloadAllSalers();
  }, [reloadAllSalers]);

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
      title: "组长",
      dataIndex: "leader_id",
      valueType: "select",
      fieldProps: {
        showSearch: true,
        options: allSalers?.map((s) => ({
          label: s.name,
          value: s.id,
        })),
      },
    },
    {
      title: "标签",
      dataIndex: "tag_names",
      valueType: "select",
      width: "35%",
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
      width: "15%",
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
            withMessage(deleteSaler(record.id)).then(() => reloadAllSalers());
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
        value={allSalers?.map((saler) => ({
          ...saler,
          tag_names: saler.tags.map((tag) => tag.name),
        }))}
        editable={{
          type: "single",
          editableKeys,
          onSave: async (rowKey, data) => {
            // leader_id清除时，默认会将key删除
            // 保留key，并设置value为null，显示指明删除leader_id
            const processedData = {
              ...data,
              leader_id: data.leader_id ?? null,
            };

            if ((rowKey as number) < 0)
              withMessage(storeSaler(processedData)).then(() =>
                setTimeout(() => {
                  reloadAllSalers();
                  reloadAllTags();
                })
              );
            else
              withMessage(updateSaler(rowKey as number, processedData)).then(
                () =>
                  setTimeout(() => {
                    reloadAllSalers();
                    reloadAllTags();
                  })
              );
          },
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
            leader: null,
            leader_id: null,
          }),
        }}
        bordered
      />
    </div>
  );
};

export default SalerManagementPage;
