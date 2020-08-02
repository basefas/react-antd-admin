import React, {Component} from 'react';
import {message, Modal} from 'antd';
import {deleteToken} from "../../../utils/auth";
import {withRouter} from "react-router-dom";


class LogoutForm extends Component {
  okHandle = () => {
    deleteToken();
    this.props.handleLogoutModalVisible(false);
    message.success("退出登录成功");
    this.props.history.replace('/login')
  };

  cancelHandle = () => {
    this.props.handleLogoutModalVisible(false)
  };

  render() {
    const {logoutModalVisible} = this.props;

    return (
      <Modal
        title="退出登录"
        visible={logoutModalVisible}
        onOk={this.okHandle}
        onCancel={this.cancelHandle}
        destroyOnClose={true}
        width={320}
      >
        <div>确定退出登录?</div>
      </Modal>
    )
  }
}

export default withRouter(LogoutForm);
