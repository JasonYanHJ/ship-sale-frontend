import {
  ContactsOutlined,
  FolderOpenOutlined,
  MailOutlined,
  SmileFilled,
  TagsOutlined,
} from "@ant-design/icons";
import { MenuDataItem } from "@ant-design/pro-components";

type ExtendedRoute = Omit<MenuDataItem, "routes"> & {
  children?: ExtendedRoute[];
  roles?: string[];
};

const route: ExtendedRoute = {
  path: "/",
  children: [
    {
      path: "/welcome",
      name: "欢迎",
      icon: <SmileFilled />,
      roles: ["admin", "dispatcher"],
    },
    {
      path: "/mail-dispatch",
      name: "分配询价邮件",
      icon: <FolderOpenOutlined />,
      roles: ["admin"],
    },
    {
      path: "/mail-forward",
      name: "转发询价邮件",
      icon: <MailOutlined />,
      roles: ["dispatcher"],
    },
    {
      path: "/salers",
      name: "销售人员",
      icon: <ContactsOutlined />,
      roles: ["admin", "dispatcher"],
    },
    {
      path: "/tags",
      name: "关键词标签",
      icon: <TagsOutlined />,
      roles: ["admin", "dispatcher"],
    },
  ],
};

export default route;
