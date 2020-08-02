import React, {Component} from 'react';
import './GlobalHeader.less'
import {LogoutOutlined, MenuFoldOutlined, MenuUnfoldOutlined} from "@ant-design/icons";
import {Dropdown, Menu} from "antd";
import LogoutForm from "./components/LogoutForm";
import {getCurrentUser} from "../../utils/auth";

class GlobalHeader extends Component {
  state = {
    logoutModalVisible: false,
  };

  onClick = () => {
    this.props.toggle()
  };

  onMenuClick = () => {
    this.handleLogoutModalVisible(true)
  };

  handleLogoutModalVisible = (visible) => {
    this.setState({
      logoutModalVisible: visible,
    });
  };

  render() {
    const {logoutModalVisible} = this.state;
    const logoutMethods = {
      handleLogoutModalVisible: this.handleLogoutModalVisible,
    };

    const menuHeaderDropdown = (
      <Menu selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <LogoutOutlined/>
          退出登录
        </Menu.Item>
      </Menu>
    );

    return (
      <div className="global-header">
        {React.createElement(this.props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
          className: 'global-header-trigger',
          onClick: this.onClick,
        })}
        <Dropdown className={'global-header-right'} overlay={menuHeaderDropdown}>
        <span className={'global-header-right-account'}>
          <span>{getCurrentUser()}</span>
        </span>
        </Dropdown>
        <LogoutForm {...logoutMethods} logoutModalVisible={logoutModalVisible}/>
      </div>
    );
  }
}

export default GlobalHeader;
