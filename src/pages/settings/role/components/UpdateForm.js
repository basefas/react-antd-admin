import React, {Component} from 'react';
import {Form, Input, Modal} from 'antd';

const {Item} = Form;

class UpdateForm extends Component {
  formRef = React.createRef();

  okHandle = () => {
    this.formRef.current.validateFields()
      .then(role => {
        this.props.handleUpdateRole(this.props.role.id, role)
      })
  };

  cancelHandle = () => {
    this.props.handleUpdateModalVisible(false)
  };

  render() {
    const {updateModalVisible, role} = this.props;

    return (
      <Modal
        title="修改用户信息"
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={this.cancelHandle}
        destroyOnClose={true}
      >
        <Form ref={this.formRef} initialValues={role}>
          <Item name="name"
                label="角色名称"
                rules={[
                  {required: true, whitespace: true, message: '请输入角色名!'},
                ]}
          >
            <Input placeholder={'角色名'}>
            </Input>
          </Item>
        </Form>
      </Modal>
    )
  }
}

export default UpdateForm;
