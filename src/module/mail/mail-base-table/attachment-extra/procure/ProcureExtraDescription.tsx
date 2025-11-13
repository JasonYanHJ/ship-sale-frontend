import { Descriptions, DescriptionsProps } from "antd";
import { ProcureExtra } from "../../../type/Attachment";

const ProcureExtraDescription = ({ extra }: { extra: ProcureExtra }) => {
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

export default ProcureExtraDescription;
