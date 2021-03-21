import React, { FC, useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { groupList } from "../../group/service";
import { roleList } from "../../role/service";
import { GroupListItem } from "../../group/data";
import { RoleListItem } from "../../role/data";
import { UserListItem, UserUpdateInfo } from "../data";

const {Item} = Form;
const {Option} = Select;

interface UpdateFormProps {
  visible: boolean;
  user: UserListItem;
  onOk: (id: number, user: UserUpdateInfo) => void;
  onCancel: () => void;
}

const UpdateForm: FC<UpdateFormProps> = (props) => {
  const {visible, user, onOk, onCancel} = props
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
        onOk(user.id, values);
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
      title="修改用户信息"
      visible={visible}
      onOk={ok}
      onCancel={onCancel}
      destroyOnClose={true}
    >
      <Form{...form_layout} form={form} initialValues={user}>
        <Item name="username"
              label="用户名"
              rules={[
                {required: true, whitespace: true, message: '请输入用户名!'},
                {pattern: /^[a-zA-Z0-9_]+$/, message: '必须是英文，数字或者下划线!'},
              ]}>
          <Input placeholder={'用户名'}>
          </Input>
        </Item>
        <Item name="email"
              label="邮箱"
              rules={[
                {required: true, whitespace: true, message: '请输入邮箱!'},
                {pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/, message: '请输入正确的邮箱格式!'},
              ]}>
          <Input placeholder={'邮箱'}>
          </Input>
        </Item>
        <Item name="group_id" label="组" rules={[{required: true}]}>
          <Select placeholder={"请选择组"}>
            {groups.map(group => {
              return (<Option key={group.id} value={group.id}>{group.name}</Option>)
            })}
          </Select>
        </Item>
        <Item name="role_id" label="角色" rules={[{required: true}]}>
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
export default UpdateForm;
