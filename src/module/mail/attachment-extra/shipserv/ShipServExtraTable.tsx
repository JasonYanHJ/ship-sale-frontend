import { Table, TableProps } from "antd";
import { ShipServExtra } from "../../Attachment";
import styled from "styled-components";
import { AnyObject } from "antd/es/_util/type";

const StyledTable = styled(Table<AnyObject>)`
  .ant-table {
    margin-block: 0 !important;
    margin-inline: 0 !important;
  }
`;

// 计算每个单元格的colSpan
// 单元格值为null时为0
// 单元格值非null时，为后续单元格连续为null的数量
function calculateColSpan(record: string[], index: number) {
  if (record[index] === null) return 0;

  let colSpan = 1;
  for (let i = index + 1; i < record.length; i++) {
    if (record[i] !== null) break;
    colSpan++;
  }

  return colSpan;
}

const ShipServExtraTable = ({ extra }: { extra: ShipServExtra }) => {
  const columns: TableProps["columns"] = extra.table_data[0].map(
    (key, index) => ({
      title: key,
      dataIndex: index,
      onCell: (record) => ({
        colSpan: calculateColSpan(record as string[], index),
      }),
    })
  );

  return (
    <div>
      <div style={{ marginTop: 8, marginLeft: 8 }}>
        <b>table:</b>
      </div>
      <StyledTable
        rowKey="key"
        bordered
        columns={columns}
        dataSource={extra.table_data.slice(1).map((row, index) => {
          // 为每行添加unique key
          const result: AnyObject = [...row];
          result.key = index;
          return result;
        })}
        pagination={false}
      />
    </div>
  );
};

export default ShipServExtraTable;
