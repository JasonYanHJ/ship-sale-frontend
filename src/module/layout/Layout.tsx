import { PageContainer, ProLayout } from "@ant-design/pro-components";
import route from "./route";
import { Outlet, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  return (
    <ProLayout
      title="销售系统"
      route={route}
      menuItemRender={(item, dom) => (
        <div onClick={() => navigate(item.path!)}>{dom}</div>
      )}
    >
      <PageContainer>
        <Outlet />
      </PageContainer>
    </ProLayout>
  );
};

export default Layout;
