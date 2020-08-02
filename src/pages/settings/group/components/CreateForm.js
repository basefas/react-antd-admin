import React, {Component} from 'react';
import {Form, Input, Modal, Select} from 'antd';

const {Item} = Form;
const {Option} = Select;

class CreateForm extends Component {
  formRef = React.createRef();

  okHandle = () => {
    this.formRef.current.validateFields()
      .then(values => {
        this.props.handleCreateGroup(values)
      })
  };

  cancelHandle = () => {
    this.props.handleCreateModalVisible(false)
  };

  render() {
    const {createModalVisible, groupsSelect} = this.props;

    const form_layout = {
      labelCol: { span: 4 },
    };

    return (
      <Modal
        title="添加组"
        visible={createModalVisible}
        onOk={this.okHandle}
        onCancel={this.cancelHandle}
        destroyOnClose={true}
      >
        <Form ref={this.formRef}
              {...form_layout}
              size="middle"
        >
          <Item name="name"
                label="名称"
                rules={[
                  {required: true, whitespace: true, message: '请输入组名!'},
                ]}
          >
            <Input placeholder={'组名'}>
            </Input>
          </Item>
          <Item name="parent_id"
                label="上级"
                rules={[
                  {required: true},
                ]}
          >
            <Select
              placeholder={"请选择父节点"}
            >
              {
                groupsSelect.map(group => {
                  return (<Option key={group.id} value={group.id}>{group.name}</Option>)
                })
              }
            </Select>
          </Item>
        </Form>
      </Modal>
    )
  }
}

export default CreateForm;
