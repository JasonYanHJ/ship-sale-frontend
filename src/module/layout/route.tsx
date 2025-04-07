import { SmileFilled, TagsOutlined } from "@ant-design/icons";
import { ProLayoutProps } from "@ant-design/pro-components";
import { GetProp } from "antd";

const route: GetProp<ProLayoutProps, "route"> = {
  path: "/",
  routes: [
    {
      path: "/welcome",
      name: "欢迎",
      icon: <SmileFilled />,
    },
    {
      path: "/tags",
      name: "关键词标签",
      icon: <TagsOutlined />,
    },
  ],
};

export default route;
