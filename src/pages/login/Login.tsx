import React, { FC } from 'react';
import "./Login.less"
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Redirect, useHistory } from "react-router-dom";
import { loggedIn, setCurrentUser, setToken } from "../../utils/auth";
import { UserLogIn } from "./data";
import { login } from "./service";

const {Item} = Form;

const Login: FC = () => {
  const history = useHistory();
  const onFinish = (user: UserLogIn) => {
    Login(user).then()
  };

  const Login = async (user: UserLogIn) => {
    const result = await login(user)
    if (result.code === 0) {
      message.success("登录成功")
      setToken(result.data.token);
      setCurrentUser(result.data.username);
      history.replace("/dashboard");
    } else {
      console.log("登录失败")
      message.error("登录失败: " + result.message);
    }
  };

  return loggedIn() ? <Redirect to={"/dashboard"}/> : (
    <div className="login">
      <Card title={"Admin System"} className="login-card">
        <Form
          name="login"
          size={"large"}
          className="login-form"
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
            <Input prefix={<UserOutlined/>} placeholder="用户名"/>
          </Item>
          <Item
            name="password"
            rules={[
              {required: true, message: '请输入密码!'}
            ]}>
            <Input.Password
              prefix={<LockOutlined/>}
              type="password"
              placeholder="密码"
            />
          </Item>
          <Item>
            <Button type="primary" htmlType="submit" className="login-form-button">
              登 录
            </Button>
          </Item>
        </Form>
      </Card>
    </div>
  );
};
export default Login;
