import styled from "styled-components";
import { BsmExtra } from "../../../type/Attachment";
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
  { dataIndex: "number", title: "S.No" },
  { dataIndex: "productCode", title: "Item Code" },
  { dataIndex: "description", title: "Item Description" },
  { dataIndex: "drawingNumber", title: "Drawing Number" },
  { dataIndex: "partNumber", title: "Part Number" },
  { dataIndex: "uomName", title: "Unit" },
  { dataIndex: "quantity", title: "Quantity" },
  { dataIndex: "remarksToVendor", title: "Remarks To Vendor" },
  { dataIndex: "equipmentName", title: "Equipment Name" },
  { dataIndex: "modelNumber", title: "Model" },
  { dataIndex: "maker", title: "Maker" },
  { dataIndex: "serialNumber", title: "Serial Number" },
];

const BsmExtraTable = ({ extra }: { extra: BsmExtra }) => {
  return (
    <div>
      <div style={{ marginTop: 8, marginLeft: 8 }}>
        <b>table:</b>
        <StyledTable
          rowKey="number"
          bordered
          columns={columns}
          dataSource={extra.table_data}
          pagination={false}
        />
      </div>
    </div>
  );
};

export default BsmExtraTable;
