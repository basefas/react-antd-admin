import React, {Component} from 'react';
import {Form, Input, Button, Checkbox, Card, message} from 'antd';
import {UserOutlined, LockOutlined} from '@ant-design/icons';
import {Redirect, withRouter} from "react-router-dom";

import "./Login.less"
import {login} from "../../services/auth";
import {loggedIn, setCurrentUser, setToken} from "../../utils/auth";

const {Item} = Form;

class Login extends Component {
  onFinish = async (values) => {
    const res = await login(values);

    if (res.code === 0) {
      setToken(res.data.token);
      setCurrentUser(res.data.username);
      message.success("登录成功");
      this.props.history.replace("/dashboard");
    } else {
      message.error(res.message);
    }
  };

  onFinishFailed = () => {
    // message.error("登录失败")
  };

  render() {
    if (loggedIn()) {
      return <Redirect to={"/dashboard"}/>
    }
    return (
      <div className="login">
        <Card title={"Admin System"} className="login-card">
          <Form name="login"
                size={"large"}
                initialValues={{remember: true,}}
                onFinish={this.onFinish}
                onFinishFailed={this.onFinishFailed}
          >
            <Item name="username"
                       rules={[
                         {required: true, whitespace: true, message: '请输入用户名!'},
                         {pattern: /^[a-zA-Z0-9_]+$/, message: '必须是英文，数字或者下划线!'},
                       ]}
            >
              <Input prefix={<UserOutlined/>}
                     placeholder="用户名"/>
            </Item>
            <Item name="password"
                       rules={[
                         {required: true, message: '请输入密码!'}
                       ]}
            >
              <Input.Password prefix={<LockOutlined/>}
                              type="password"
                              visibilityToggle={"false"}
                              placeholder="密码"/>
            </Item>
            <Item>
              <Item name="remember"
                         valuePropName="checked"
                         noStyle>
                <Checkbox>
                  记住我
                </Checkbox>
              </Item>
              <a className="login-form-forgot" href="/f">忘记密码</a>
            </Item>
            <Item>
              <Button
                type="primary"
                htmlType="submit"
                className="login-form-button">
                登 录
              </Button>
            </Item>
          </Form>
        </Card>
      </div>
    );
  }
}

export default withRouter(Login);
