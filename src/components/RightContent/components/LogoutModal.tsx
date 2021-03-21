import React, { useEffect } from 'react';
import { useHistory } from "react-router-dom";
import { deleteToken } from "../../../utils/auth";
import { message, Modal } from "antd";

interface LogoutModalProps {
  visible: boolean;
  changeLogoutModalVisible: Function;
}

const LogoutModal: React.FC<LogoutModalProps> = (props) => {
  const history = useHistory();
  const {visible, changeLogoutModalVisible} = props

  useEffect(() => {
    changeLogoutModalVisible(visible)
  }, [visible, changeLogoutModalVisible]);

  const okHandle = () => {
    deleteToken();
    message.success("退出登录成功");
    changeLogoutModalVisible(false)
    history.replace('/login')
  };
  const cancelHandle = () => {
    changeLogoutModalVisible(false)
  };

  return (
    <Modal
      title="退出登录"
      visible={visible}
      onOk={okHandle}
      onCancel={cancelHandle}
      destroyOnClose={true}
      width={320}
    >
      <div>确定退出登录?</div>
    </Modal>
  )

};
export default LogoutModal;
