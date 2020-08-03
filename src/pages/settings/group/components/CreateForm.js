import React, {Component} from 'react';
import {Form, Input, Modal, Select} from 'antd';
import {roleList} from "../../role/service";

const {Item} = Form;
const {Option} = Select;

class CreateForm extends Component {
  formRef = React.createRef();

  state = {
    roles: [],
  };

  componentDidMount() {
    this.getRoleList()
  }

  getRoleList = async () => {
    const res = await roleList();
    if (res.code === 0) {
      this.setState(
        {
          roles: res.data || [],
        }
      );
    }
  };

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
    const {createModalVisible} = this.props;
    const {roles} = this.state;

    const form_layout = {
      labelCol: {span: 4},
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
                  {required: true, whitespace: true, message: '请输入组名称!'},
                ]}
          >
            <Input placeholder={'组名称'}>
            </Input>
          </Item>
          <Item name="role_id"
                label="角色"
                rules={[
                  {required: true},
                ]}
          >
            <Select
              placeholder={"请选择角色"}
            >
              {roles.map(role => {
                return (<Option key={role.id} value={role.id}>{role.name}</Option>)
              })}
            </Select>
          </Item>
        </Form>
      </Modal>
    )
  }
}

export default CreateForm;
