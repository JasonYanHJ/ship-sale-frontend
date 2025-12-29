import styled from "styled-components";
import { VshipExtra } from "../../../type/Attachment";
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
  { dataIndex: "RodLineNo", title: "Item" },
  { dataIndex: "Enquired", title: "Qty" },
  { dataIndex: "UnitType", title: "UOM" },
  { dataIndex: "PartName", title: "Description" },
  { dataIndex: "MakersRef", title: "Makers Reference" },
  { dataIndex: "DrawingPos", title: "Drawing Position" },
  { dataIndex: "SparePartNotes", title: "Order Line Notes" },
];

const VshipExtraTable = ({ extra }: { extra: VshipExtra }) => {
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

export default VshipExtraTable;
