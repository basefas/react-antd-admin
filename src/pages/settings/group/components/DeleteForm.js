import React, {Component} from 'react';
import {Modal} from 'antd';


class DeleteForm extends Component {
  okHandle = () => {
    this.props.handleDeleteGroup(this.props.group.id)
  };

  cancelHandle = () => {
    this.props.handleDeleteModalVisible(false)
  };

  render() {
    const {deleteModalVisible} = this.props;

    return (
      <Modal
        title="删除组"
        visible={deleteModalVisible}
        onOk={this.okHandle}
        onCancel={this.cancelHandle}
        destroyOnClose={true}
        width={320}
      >
        <div>确定删除组?</div>
      </Modal>
    )
  }
}

export default DeleteForm;
