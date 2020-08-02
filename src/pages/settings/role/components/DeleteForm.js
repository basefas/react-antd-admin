import React, {Component} from 'react';
import {Modal} from 'antd';


class DeleteForm extends Component {
  okHandle = () => {
    this.props.handleDeleteRole(this.props.role.id)
  };

  cancelHandle = () => {
    this.props.handleDeleteModalVisible(false)
  };

  render() {
    const {deleteModalVisible} = this.props;

    return (
      <Modal
        title="删除角色"
        visible={deleteModalVisible}
        onOk={this.okHandle}
        onCancel={this.cancelHandle}
        destroyOnClose={true}
        width={320}
      >
        <div>确定删除角色?</div>
      </Modal>
    )
  }
}

export default DeleteForm;
