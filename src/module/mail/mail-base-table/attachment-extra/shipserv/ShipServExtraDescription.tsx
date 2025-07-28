import { Descriptions, DescriptionsProps } from "antd";
import { ShipServExtra } from "../../../type/Attachment";

const ShipServExtraDescription = ({ extra }: { extra: ShipServExtra }) => {
  const metaItems: DescriptionsProps["items"] = Object.entries(
    extra.meta_data
  ).map(([key, value]) => ({
    label: key,
    children: value,
  }));

  return (
    <div>
      <Descriptions colon={false} bordered size="small" items={metaItems} />
    </div>
  );
};

export default ShipServExtraDescription;
