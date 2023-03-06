import React, { FC, useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { groupList } from "../../group/service";
import { roleList } from "../../role/service";
import { GroupListItem } from "../../group/data";
import { RoleListItem } from "../../role/data";
import { UserCreateInfo } from "../data";

const {Item} = Form;
const {Option} = Select;

interface CreateFormProps {
  open: boolean;
  onOk: (user: UserCreateInfo) => void;
  onCancel: () => void;
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const {open, onOk, onCancel} = props
  const [groups, setGroups] = useState<GroupListItem[]>([])
  const [roles, setRoles] = useState<RoleListItem[]>([])
  const [form] = Form.useForm();

  const getGroupList = async () => {
    const result = await groupList();
    setGroups(result.data);
  };

  const getRoleList = async () => {
    const result = await roleList();
    setRoles(result.data);
  };

  useEffect(() => {
    getGroupList().then()
    getRoleList().then()
  }, []);

  const ok = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        onOk(values);
      })
      .catch(info => {
        console.log('参数校验失败:', info);
      });
  }

  const form_layout = {
    labelCol: {span: 4},
  };

  return (
    <Modal
      title="添加用户"
      open={open}
      onOk={ok}
      onCancel={onCancel}
      destroyOnClose={true}
    >
      <Form{...form_layout} form={form}>
        <Item name="username" label="用户名" rules={[
          {required: true, whitespace: true, message: '请输入用户名!'},
          {pattern: /^[a-zA-Z0-9_]+$/, message: '必须是英文，数字或者下划线!'}
        ]}>
          <Input placeholder={'用户名'} />
        </Item>
        <Item name="email" label="邮箱" rules={[
          {required: true, whitespace: true, message: '请输入邮箱!'},
          {pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱格式!'}
        ]}>
          <Input placeholder={'邮箱'} />
        </Item>
        <Item name="password" label="密码" rules={[
          {required: true, whitespace: true, message: '请输入密码!'},
          {min: 6, message: '密码不能小于6位!'},
        ]}>
          <Input placeholder={'密码'} />
        </Item>
        <Item name="group_id" label="分组" rules={[{required: true},]}>
          <Select placeholder={"请选择分组"}>
            {groups.map(group => {
              return (<Option key={group.id} value={group.id}>{group.name}</Option>)
            })}
          </Select>
        </Item>
        <Item name="role_id" label="角色" rules={[{required: true},]}>
          <Select placeholder={"请选择角色"}>
            {roles.map(role => {
              return (<Option key={role.id} value={role.id}>{role.name}</Option>)
            })}
          </Select>
        </Item>
      </Form>
    </Modal>
  )
}
export default CreateForm;
