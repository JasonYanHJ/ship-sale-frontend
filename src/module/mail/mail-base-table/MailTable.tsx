import {
  ProColumns,
  ProTable,
  ProTableProps,
} from "@ant-design/pro-components";
import { MailRequestParams, MailResponse } from "../mailService";
import { ApiResponse } from "../../../service/api-request/ApiResponse";
import useResizeObserver from "use-resize-observer";
import { mutate } from "swr";
import MailContentDisplay from "./MailContentDisplay";
import AttachmentTable from "./AttachmentTable";
import styled from "styled-components";
import { useState, useEffect } from "react";
import useDefaultExpandAll from "./useDefaultExpandAll";
import { Checkbox, Space } from "antd";

export type MailTableDataSourceType = MailResponse["data"][0];

const StyledTable = styled(
  ProTable<MailTableDataSourceType, MailRequestParams>
)`
  .ant-table-cell:not(.ant-table-expanded-row .ant-table-cell):not(
      thead .ant-table-cell
    ) {
    background-color: #e9f4fe;
  }
`;

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
      <MailContentDisplay record={record} />
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

  const [dataSource, setDataSource] = useState<MailTableDataSourceType[]>([]);
  const [expandAll, setExpandAll] = useDefaultExpandAll();
  const [expandedRows, setExpandedRows] = useState<readonly React.Key[]>([]);
  useEffect(() => {
    if (expandAll) {
      setExpandedRows(dataSource.map((m) => m.id));
    } else {
      setExpandedRows([]);
    }
  }, [expandAll, dataSource]);

  return (
    <StyledTable
      className="mail-table"
      rowKey="id"
      columns={columns}
      request={async (params) => {
        mutate("/tags");
        const response = (await mailRequest(params)).data;
        return { data: response.data, total: response.total, success: true };
      }}
      bordered
      onDataSourceChange={setDataSource}
      expandable={{
        expandedRowKeys: expandedRows,
        onExpandedRowsChange: setExpandedRows,
        expandedRowRender: (record) =>
          expandedRowRender(record, containerWidth),
      }}
      {...props}
      toolBarRender={(...args) => [
        ...(props.toolBarRender ? props.toolBarRender(...args) : []),
        <Space key="default-row-expanded">
          默认展开
          <Checkbox
            checked={expandAll}
            onChange={(e) => setExpandAll(e.target.checked)}
          />
        </Space>,
      ]}
    />
  );
};

export default MailTable;
