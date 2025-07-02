import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import zhCN from "antd/locale/zh_CN";
import "./App.css";
import Layout from "./module/layout/Layout";
import {
  Navigate,
  Route,
  BrowserRouter as Router,
  Routes,
} from "react-router-dom";
import PageNotFound from "./module/layout/PageNotFound";
import TagManagementPage from "./module/tag/TagManagementPage";
import SalerManagementPage from "./module/saler/SalerManagementPage";
import MailForwardPage from "./module/mail/MailForwardPage";
import { AuthProvider } from "./module/auth/useAuth";
import LoginAndRegisterForm from "./module/auth/LoginAndRegister";
import MailDispatchPage from "./module/mail/MailDispatchPage";

dayjs.locale("zh-cn");

const App = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginAndRegisterForm />} />

            <Route element={<Layout />}>
              <Route path="/welcome" element={<div>hello</div>} />
              <Route path="/mail-dispatch" element={<MailDispatchPage />} />
              <Route path="/mail-forward" element={<MailForwardPage />} />
              <Route path="/tags" element={<TagManagementPage />} />
              <Route path="/salers" element={<SalerManagementPage />} />
            </Route>

            <Route path="/" element={<Navigate to="/welcome" replace />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ConfigProvider>
  );
};

export default App;
