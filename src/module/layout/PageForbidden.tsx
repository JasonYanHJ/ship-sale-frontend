import { Button, Result } from "antd";
import { NavLink } from "react-router-dom";

const PageForbidden = () => {
  return (
    <Result
      status="403"
      title="403 Forbidden"
      extra={
        <NavLink to="/">
          <Button type="primary">返回首页</Button>
        </NavLink>
      }
    />
  );
};

export default PageForbidden;
