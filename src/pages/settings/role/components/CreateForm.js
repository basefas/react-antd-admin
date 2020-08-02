import React, {Component} from 'react';
import {Form, Input, Modal} from 'antd';

const {Item} = Form;

class CreateForm extends Component {
  formRef = React.createRef();

  okHandle = () => {
    this.formRef.current.validateFields()
      .then(values => {
        this.props.handleCreateRole(values)
      })
  };

  cancelHandle = () => {
    this.props.handleCreateModalVisible(false)
  };

  render() {
    const {createModalVisible} = this.props;

    return (
      <Modal
        title="添加角色"
        visible={createModalVisible}
        onOk={this.okHandle}
        onCancel={this.cancelHandle}
        destroyOnClose={true}
      >
        <Form ref={this.formRef}>
          <Item name="name"
                label="角色名称"
                rules={[
                  {required: true, whitespace: true, message: '请输入角色名称!'},
                ]}
          >
            <Input placeholder={'角色名称'}>
            </Input>
          </Item>
        </Form>
      </Modal>
    )
  }
}

export default CreateForm;
