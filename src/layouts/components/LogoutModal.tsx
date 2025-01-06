import { useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { message, Modal } from "antd";
import { deleteToken } from "../../utils/auth";

interface LogoutModalProps {
  open: boolean;
  changeLogoutModalVisible: Function;
}

const LogoutModal: React.FC<LogoutModalProps> = (props) => {
  const navigate = useNavigate();
  const {open, changeLogoutModalVisible} = props

  useEffect(() => {
    changeLogoutModalVisible(open)
  }, [open, changeLogoutModalVisible]);

  const okHandle = () => {
    deleteToken();
    message.success("退出登录成功").then();
    changeLogoutModalVisible(false)
    navigate('/login')
  };
  const cancelHandle = () => {
    changeLogoutModalVisible(false)
  };


  return (
    <Modal
      title="退出登录"
      open={open}
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
