import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LoginForm, ProFormText } from "@ant-design/pro-components";
import { LockOutlined, MailOutlined, UserOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import useAuth from "./useAuth";
import { withMessage } from "../../service/api-request/apiRequest";

type RegisterFormDateType = {
  name: string;
  email: string;
  password: string;
};
type LoginFormDateType = {
  email: string;
  password: string;
};

const LoginAndRegisterForm = () => {
  const [loginType, setLoginType] = useState("login");
  const navigate = useNavigate();
  const location = useLocation();

  const { login, register } = useAuth();

  // 获取重定向路径
  const from = location.state?.from?.pathname || "/";

  // 登录处理函数
  const handleLogin = async (values: LoginFormDateType) => {
    const { email, password } = values;
    await withMessage(login(email, password));
    navigate(from, { replace: true });
  };

  // 注册处理函数
  const handleRegister = async (values: RegisterFormDateType) => {
    const { name, email, password } = values;
    await withMessage(register(name, email, password));
    navigate(from, { replace: true });
  };

  return (
    <div style={{ maxWidth: "400px", margin: "0 auto", padding: "40px 0" }}>
      <LoginForm
        title="Dan-Marine"
        subTitle="登录或注册您的账号"
        submitter={{
          searchConfig: { submitText: loginType === "login" ? "登录" : "注册" },
        }}
        onFinish={loginType === "login" ? handleLogin : handleRegister}
      >
        <Tabs
          activeKey={loginType}
          onChange={setLoginType}
          centered
          items={[
            {
              key: "login",
              label: "登录",
            },
            {
              key: "register",
              label: "注册",
            },
          ]}
        />

        {loginType === "login" && (
          <>
            <ProFormText
              name="email"
              fieldProps={{
                size: "large",
                prefix: <MailOutlined />,
              }}
              placeholder="邮箱"
              rules={[
                {
                  required: true,
                  message: "请输入邮箱",
                },
                {
                  type: "email",
                  message: "请输入有效的邮箱地址",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined />,
              }}
              placeholder="密码"
              rules={[
                {
                  required: true,
                  message: "请输入密码",
                },
              ]}
            />
          </>
        )}

        {loginType === "register" && (
          <>
            <ProFormText
              name="email"
              fieldProps={{
                size: "large",
                prefix: <MailOutlined />,
              }}
              placeholder="邮箱"
              rules={[
                {
                  required: true,
                  message: "请输入邮箱",
                },
                {
                  type: "email",
                  message: "请输入有效的邮箱地址",
                },
              ]}
            />
            <ProFormText
              name="name"
              fieldProps={{
                size: "large",
                prefix: <UserOutlined />,
              }}
              placeholder="用户名"
              rules={[
                {
                  required: true,
                  message: "请输入用户名",
                },
              ]}
            />
            <ProFormText.Password
              name="password"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined />,
              }}
              placeholder="密码"
              rules={[
                {
                  required: true,
                  message: "请输入密码",
                },
                {
                  min: 8,
                  message: "密码长度不能少于8位",
                },
              ]}
            />
            <ProFormText.Password
              name="confirmPassword"
              fieldProps={{
                size: "large",
                prefix: <LockOutlined />,
              }}
              placeholder="确认密码"
              rules={[
                {
                  required: true,
                  message: "请确认密码",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("两次输入的密码不一致"));
                  },
                }),
              ]}
            />
          </>
        )}
      </LoginForm>
    </div>
  );
};

export default LoginAndRegisterForm;
