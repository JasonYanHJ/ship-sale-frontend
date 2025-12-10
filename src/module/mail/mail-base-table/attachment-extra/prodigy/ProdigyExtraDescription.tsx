import { Descriptions, DescriptionsProps } from "antd";
import { ProdigyExtra } from "../../../type/Attachment";

const ProdigyExtraDescription = ({ extra }: { extra: ProdigyExtra }) => {
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

export default ProdigyExtraDescription;
