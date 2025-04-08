import { ProColumns, ProTable } from "@ant-design/pro-components";
import { Mail } from "./Mail";
import { Select, Space } from "antd";
import { useEffect, useState } from "react";
import { SalerWithTags } from "../saler/Saler";
import { getAllSalers } from "../saler/salerService";

type DataSourceType = Omit<Mail, "created_at" | "updated_at">;

const dataSource: DataSourceType[] = [
  {
    id: "1743770830",
    status: 1,
    received_at: "2025-04-04 21:00:15",
    extracted_info: {
      pdf: "RFQ-BNE250111R09.pdf",
      subject: "Spares: Control air dryer complete",
      equipment_section_name: null,
      descriptions: ["Compressed air dryer - complete"],
    },
  },
  {
    id: "1743770831",
    status: 1,
    received_at: "2025-04-05 18:00:15",
    extracted_info: {
      pdf: "RFQ-ATU-0074-2025-DO.pdf",
      subject: "DD`Anodes for Hull/Rudder/Sea chest",
      equipment_section_name: "Hull",
      descriptions: [
        "Bolted anodes , Maker: Cathodic Protection Technology Pte.ltd, PartNo: B9F, Spec: Bolted anodes B9F 5.5 kg",
        "Welded anodes for Rope guard, Maker: Cathodic Protection Technology Pte.ltd, PartNo: W131, Spec: Welded aluminium anodes for Rope guard W131 1.4kg",
        "Welded anodes for Rudder, Maker: Cathodic Protection Technology Pte.ltd, PartNo: W119, Spec: Welded aluminium anodes for Rudder W119 14.1kg",
        "Welded anodes for Stern , Maker: Cathodic Protection Technology Pte.ltd, PartNo: W117, Spec: Welded aluminium anodes for Stern W117 11.6kg",
      ],
    },
  },
  {
    id: "1743770832",
    status: 2,
    received_at: "2025-04-04 21:00:15",
    extracted_info: {
      pdf: "RFQ-BNE250111R09.pdf",
      subject: "Spares: Control air dryer complete",
      equipment_section_name: "UREBALLAST BALLAST WATER TREATMENT SYSTEM",
      descriptions: ["Compressed air dryer - complete"],
    },
  },
];

const MailManagementPage = () => {
  const [allSalers, setAllSalers] = useState<SalerWithTags[] | null>(null);
  useEffect(() => {
    getAllSalers().then(({ data: salers }) => setAllSalers(salers));
  }, []);

  const columns: ProColumns<DataSourceType>[] = [
    {
      title: "ID",
      dataIndex: "id",
      width: 100,
    },
    {
      title: "状态",
      dataIndex: "status",
      width: 100,
      valueEnum: {
        1: {
          text: "待转发",
          status: "Warning",
        },
        2: {
          text: "已转发",
          status: "Success",
        },
      },
    },
    {
      title: "时间",
      dataIndex: "received_at",
      ellipsis: true,
    },
    {
      title: "询价单信息提取",
      children: [
        {
          title: "Subject",
          dataIndex: ["extracted_info", "subject"],
          ellipsis: true,
        },
        {
          title: "Equipment Section Name",
          dataIndex: ["extracted_info", "equipment_section_name"],
          ellipsis: true,
        },
        {
          title: "Item Descriptions",
          dataIndex: ["extracted_info", "descriptions"],
          ellipsis: true,
        },
      ],
    },
    {
      title: "转发给",
      render: (_dom, _entity, index) => (
        <Space>
          {index === 0 ? (
            <>
              <a>请选择</a>
            </>
          ) : index === 1 ? (
            <>
              Teresa<a>重选</a>
            </>
          ) : (
            "Amy"
          )}
        </Space>
      ),
    },
    {
      title: "操作",
      width: 200,
      render: (_dom, entity, index) => (
        <Space>
          {index !== 2 && <a>转发</a>}
          <a>添加标签</a>
          <a
            href={`http://127.0.0.1:8000/api/pdf/${entity.extracted_info.pdf}`}
            target="_blank"
          >
            查看附件
          </a>
        </Space>
      ),
    },
  ];

  return <ProTable<DataSourceType> columns={columns} dataSource={dataSource} />;
};

export default MailManagementPage;
