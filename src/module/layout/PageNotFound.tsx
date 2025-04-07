import { Button, Result } from "antd";
import { NavLink } from "react-router-dom";

const PageNotFound = () => {
  return (
    <Result
      status="404"
      title="404 Not Found"
      extra={
        <NavLink to="/">
          <Button type="primary">返回首页</Button>
        </NavLink>
      }
    />
  );
};

export default PageNotFound;
