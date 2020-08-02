import React, {Component} from 'react';
import {Form, Input, Modal, Select} from 'antd';
import {groupList} from "../../group/service";
import {roleList} from "../../role/service";

const {Item} = Form;
const {Option} = Select;

class CreateForm extends Component {
  formRef = React.createRef();

  state = {
    groups: [],
    roles: [],
  };

  componentDidMount() {
    this.getGroupList();
    this.getRoleList()
  }

  getGroupList = async () => {
    const res = await groupList();
    if (res.code === 0) {
      this.setState(
        {
          groups: res.data || [],
        }
      );
    }
  };

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
        this.props.handleCreateUser(values)
      })
  };

  cancelHandle = () => {
    this.props.handleCreateModalVisible(false)
  };


  render() {
    const {createModalVisible} = this.props;
    const {groups, roles} = this.state;

    const form_layout = {
      labelCol: { span: 4 },
    };

    return (
      <Modal
        title="添加用户"
        visible={createModalVisible}
        onOk={this.okHandle}
        onCancel={this.cancelHandle}
        destroyOnClose={true}
      >
        <Form
          ref={this.formRef}
          {...form_layout}
        >
          <Item name="username"
                label="用户名"
                rules={[
                  {required: true, whitespace: true, message: '请输入用户名!'},
                  {pattern: /^[a-zA-Z0-9_]+$/, message: '必须是英文，数字或者下划线!'},
                ]}
          >
            <Input placeholder={'用户名'}>
            </Input>
          </Item>
          <Item name="email"
                label="邮箱"
                rules={[
                  {required: true, whitespace: true, message: '请输入邮箱!'},
                  {
                    pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                    message: '请输入正确的邮箱格式!'
                  },
                ]}
          >
            <Input placeholder={'邮箱'}>
            </Input>
          </Item>
          <Item name="password"
                label="密码"
                rules={[
                  {required: true, whitespace: true, message: '请输入密码!'},
                  {min: 6, message: '密码不能小于6位!'},
                ]}
          >
            <Input placeholder={'密码'}>
            </Input>
          </Item>
          <Item name="group_id"
                label="组"
                rules={[
                  {required: true},
                ]}
          >
            <Select
              placeholder={"请选择组"}
            >
              {groups.map(group => {
                return (<Option key={group.id} value={group.id}>{group.name}</Option>)
              })}
            </Select>
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
