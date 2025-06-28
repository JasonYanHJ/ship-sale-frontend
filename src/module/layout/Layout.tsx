import { PageContainer, ProLayout } from "@ant-design/pro-components";
import route from "./route";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";
import useAuth from "../auth/useAuth";
import { Spin, Tooltip } from "antd";
import { LogoutOutlined } from "@ant-design/icons";
import { withMessage } from "../../service/api-request/apiRequest";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const { user, logout } = useAuth();

  if (user === null) return <Spin fullscreen delay={200} />;

  if (user === "guest")
    return <Navigate to="/login" state={{ from: location }} replace />;

  return (
    <ProLayout
      title="销售系统"
      route={route}
      menuItemRender={(item, dom) => (
        <div onClick={() => navigate(item.path!)}>{dom}</div>
      )}
      avatarProps={{
        title: user.name,
        size: "small",
      }}
      actionsRender={() => [
        <Tooltip key="logout" title="退出登录">
          <LogoutOutlined onClick={() => withMessage(logout())} />
        </Tooltip>,
      ]}
    >
      <PageContainer>
        <Outlet />
      </PageContainer>
    </ProLayout>
  );
};

export default Layout;
