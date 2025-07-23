import { Descriptions, DescriptionsProps } from "antd";
import { ShipServExtra } from "../../Attachment";

const ShipServExtraDescription = ({ extra }: { extra: ShipServExtra }) => {
  const metaItems: DescriptionsProps["items"] = Object.entries(
    extra.meta_data
  ).map(([key, value]) => ({
    label: key,
    children: value,
  }));

  const sectionItems: DescriptionsProps["items"][] = extra.section_data.map(
    (section) =>
      Object.entries(section).map(([key, value]) => ({
        label: key,
        children: value,
      }))
  );

  return (
    <div>
      <Descriptions colon={false} bordered size="small" items={metaItems} />
      {sectionItems.length > 0 && (
        <div style={{ marginTop: 8, marginLeft: 8 }}>
          <b>sections:</b>
        </div>
      )}
      {sectionItems.map((items, i) => (
        <Descriptions
          key={i}
          style={{ marginTop: 8 }}
          colon={false}
          bordered
          size="small"
          items={items}
        />
      ))}
    </div>
  );
};

export default ShipServExtraDescription;
