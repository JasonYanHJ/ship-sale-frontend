import { useRef, useState } from "react";
import { Tag } from "./Tag";
import {
  ActionType,
  EditableProTable,
  ProColumns,
} from "@ant-design/pro-components";
import { deleteTag, getAllTags, storeTag, updateTag } from "./tagService";
import { Tag as AntdTag, Popconfirm } from "antd";
import { withMessage } from "../../service/api-request/apiRequest";

type DataSourceType = Omit<Tag, "created_at" | "updated_at">;

const TagManagementPage = () => {
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const actionRef = useRef<ActionType>();

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "标签名称",
      dataIndex: "name",
      render: (dom) => <AntdTag>{dom}</AntdTag>,
    },
    {
      title: "操作",
      valueType: "option",
      width: 200,
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
            withMessage(deleteTag(record.id)).then(() => action?.reload?.());
          }}
        >
          <a>删除</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <EditableProTable<DataSourceType>
      rowKey="id"
      columns={columns}
      actionRef={actionRef}
      request={async () => {
        const tags = (await getAllTags()).data;
        return { data: tags, total: tags.length, success: true };
      }}
      editable={{
        type: "single",
        editableKeys,
        onSave: async (rowKey, data) =>
          (rowKey as number) < 0
            ? withMessage(storeTag({ name: data.name })).then(() =>
                setTimeout(() => actionRef.current?.reload())
              )
            : withMessage(
                updateTag(rowKey as number, { name: data.name })
              ).then(() => setTimeout(() => actionRef.current?.reload())),
        onChange: setEditableRowKeys,
        actionRender: (_row, _config, defaultDoms) => {
          return [defaultDoms.save, defaultDoms.cancel];
        },
      }}
      recordCreatorProps={{
        position: "bottom",
        creatorButtonText: "添加新的关键词标签",
        record: () => ({
          id: Math.floor(-99999 * Math.random()),
          name: "新标签",
        }),
      }}
      bordered
    />
  );
};

export default TagManagementPage;
