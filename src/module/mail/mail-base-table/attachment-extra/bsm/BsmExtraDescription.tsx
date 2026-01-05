import { Descriptions, DescriptionsProps } from "antd";
import { BsmExtra } from "../../../type/Attachment";

const BsmExtraDescription = ({ extra }: { extra: BsmExtra }) => {
  const metaItems: DescriptionsProps["items"] = Object.entries(
    extra.meta_data
  ).map(([key, value]) => ({
    label: key,
    children: value && value.split("\n").flatMap((x) => [x, <br />]),
    span: 3,
  }));

  return (
    <div>
      <Descriptions colon={false} bordered size="small" items={metaItems} />
    </div>
  );
};

export default BsmExtraDescription;
