import styled from "styled-components";
import { ProdigyExtra } from "../../../type/Attachment";
import { Table } from "antd";
import { TableProps } from "antd/lib";
import { AnyObject } from "antd/es/_util/type";

const StyledTable = styled(Table<AnyObject>)`
  .ant-table {
    margin-block: 0 !important;
    margin-inline: 0 !important;
  }
`;

const columns: TableProps["columns"] = [
  { title: "Item Description", dataIndex: "itemDescription" },
  { title: "Maker Ref", dataIndex: "makerRef" },
  { title: "Part No", dataIndex: "partNo" },
  { title: "Drawing No", dataIndex: "drawingNo" },
  { title: "Position No", dataIndex: "positionNo" },
  { title: "Component", dataIndex: "componentName" },
  { title: "Maker", dataIndex: "maker" },
  { title: "Model", dataIndex: "model" },
  { title: "Serial No", dataIndex: "componentSerialNo" },
  { title: "Req. Qty", dataIndex: "requestedQty" },
  { title: "Req. UOM", dataIndex: ["requestedUOM", "name"] },
  { title: "Offer Qty", dataIndex: "offeredQty" },
  { title: "Offer UOM", dataIndex: ["offeredUOM", "name"] },
];

const ProdigyExtraTables = ({ extra }: { extra: ProdigyExtra }) => {
  return (
    <div>
      <div style={{ marginTop: 8, marginLeft: 8 }}>
        <b>table:</b>
        <StyledTable
          rowKey="rfqLineNo"
          bordered
          columns={columns}
          dataSource={extra.table_data}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default ProdigyExtraTables;
