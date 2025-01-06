import { FC } from 'react';
import { useEmotionCss } from "@ant-design/use-emotion-css";

import { Button, Card, Form, Input, message } from 'antd';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import { setCurrentUser, setToken } from "../../utils/auth";
import { UserLogIn } from "./data";
import { login } from "./service";
import bg from "../../assets/background.png"

const {Item} = Form;

const Login: FC = () => {
  const navigate = useNavigate();

  const containerClassName = useEmotionCss(() => {
    return {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage: `url(${bg})`,
      backgroundSize: '100% 100%',
    };
  });

  const onFinish = (user: UserLogIn) => {
    Login(user).then()
  };

  const Login = async (user: UserLogIn) => {
    const result = await login(user)
    if (result.code === 0) {
      message.success("登录成功")
      setToken(result.data.token);
      setCurrentUser(result.data.username);
      navigate("/dashboard");
    } else {
      console.log("登录失败")
      message.error("登录失败: " + result.message);
    }
  };

  return (
    <div className={containerClassName}>
      <Card title={import.meta.env.PLATFORM_NAME || "React Antd Admin"}
            style={{margin: '160px auto', width: '480px'}}
      >
        <Form
          name="login"
          size={"large"}
          initialValues={{remember: true}}
          onFinish={onFinish}
        >
          <Item
            name="username"
            rules={[
              {required: true, whitespace: true, message: '请输入用户名!'},
              {pattern: /^[a-zA-Z0-9_]+$/, message: '必须是英文，数字或者下划线!'},
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="用户名" />
          </Item>
          <Item
            name="password"
            rules={[
              {required: true, message: '请输入密码!'}
            ]}>
            <Input.Password
              prefix={<LockOutlined />}
              type="password"
              placeholder="密码"
            />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" style={{width: '100%'}}>
              登 录
            </Button>
          </Item>
        </Form>
      </Card>
    </div>
  );
};
export default Login;
