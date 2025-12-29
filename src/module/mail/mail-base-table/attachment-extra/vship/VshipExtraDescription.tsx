import { Descriptions, DescriptionsProps } from "antd";
import { VshipExtra } from "../../../type/Attachment";

const VshipExtraDescription = ({ extra }: { extra: VshipExtra }) => {
  const metaItems: DescriptionsProps["items"] = Object.entries(
    extra.meta_data
  ).map(([key, value]) => ({
    label: key,
    children: value.split("\n").flatMap((x) => [x, <br />]),
    span: key === "Title" || key.includes("Notes") ? 3 : 1,
  }));

  return (
    <div>
      <Descriptions colon={false} bordered size="small" items={metaItems} />
    </div>
  );
};

export default VshipExtraDescription;
