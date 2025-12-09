import { Table, TableProps } from "antd";
import { ProcureExtra } from "../../../type/Attachment";
import styled from "styled-components";
import { AnyObject } from "antd/es/_util/type";

const StyledTable = styled(Table<AnyObject>)`
  .ant-table {
    margin-block: 0 !important;
    margin-inline: 0 !important;
  }
`;

const ProcureExtraTable = ({ table }: { table: (string | null)[][] }) => {
  const tableHeaderIndex = table.findIndex((row) => row[0]?.startsWith("No."));

  const columns: TableProps["columns"] = table[tableHeaderIndex].map(
    (key, index) => ({
      title: key,
      dataIndex: index,
      render: (value) => {
        if (typeof value !== "string") return value;
        return (
          <div
            dangerouslySetInnerHTML={{ __html: value.replace(/\n/g, "<br/>") }}
          />
        );
      },
    })
  );

  return (
    <StyledTable
      rowKey="key"
      bordered
      title={() => (
        <div
          dangerouslySetInnerHTML={{
            __html: table
              .slice(0, tableHeaderIndex)
              .flat()
              .filter((x) => !!x)
              .join("\n")
              .replace(/\n/g, "<br/>"),
          }}
        />
      )}
      columns={columns}
      dataSource={table.slice(tableHeaderIndex + 1).map((row, index) => {
        // 为每行添加unique key
        const result: AnyObject = [...row];
        result.key = index;
        return result;
      })}
      pagination={false}
    />
  );
};

const ProcureExtraTables = ({ extra }: { extra: ProcureExtra }) => {
  return (
    <div>
      <div style={{ marginTop: 8, marginLeft: 8 }}>
        <b>table:</b>
      </div>
      {extra.table_data.map((table, index) => (
        <ProcureExtraTable key={index} table={table} />
      ))}
    </div>
  );
};

export default ProcureExtraTables;
