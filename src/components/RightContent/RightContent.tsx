import { Menu, Dropdown } from 'antd';
import './RightContent.less'
import React, { useState } from 'react';
import { LogoutOutlined } from "@ant-design/icons";
import { getCurrentUser } from "../../utils/auth";
import LogoutModal from "./components/LogoutModal";

const RightContent: React.FC = () => {
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const onMenuClick = () => {
    setLogoutModalVisible(true)
  };

  const menuHeaderDropdown = (
    <Menu selectedKeys={[]} onClick={onMenuClick}>
      <Menu.Item key="logout">
        <LogoutOutlined/>
        退出登录
      </Menu.Item>
    </Menu>
  );

  const changeLogoutModalVisible = (status: boolean) => {
    setLogoutModalVisible(status)
  }

  return (
    <div className="right">
      <Dropdown className={'action'} overlay={menuHeaderDropdown}>
        <span>
          <span>{getCurrentUser()}</span>
        </span>
      </Dropdown>
      {logoutModalVisible ?
        <LogoutModal
          visible={logoutModalVisible}
          changeLogoutModalVisible={changeLogoutModalVisible}/> : null}
    </div>
  );
};
export default RightContent;
