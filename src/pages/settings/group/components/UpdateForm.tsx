import React, { FC, useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { GroupListItem, GroupUpdateInfo } from "../data";
import { RoleListItem } from "../../role/data";
import { roleList } from "../../role/service";

const {Item} = Form;
const {Option} = Select;

interface UpdateFormProps {
  visible: boolean;
  group: GroupListItem;
  onOk: (id: number, group: GroupUpdateInfo) => void;
  onCancel: () => void;
}

const UpdateForm: FC<UpdateFormProps> = (props) => {
  const {visible, group, onOk, onCancel} = props
  const [roles, setRoles] = useState<RoleListItem[]>([])
  const [form] = Form.useForm();

  const getRoleList = async () => {
    const result = await roleList();
    setRoles(result.data);
  };

  useEffect(() => {
    getRoleList().then()
  }, []);

  const ok = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        onOk(group.id, values);
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
      title="修改组信息"
      visible={visible}
      onOk={ok}
      onCancel={onCancel}
      destroyOnClose={true}>
      <Form{...form_layout} form={form} initialValues={group}>
        <Item name="name" label="名称" rules={[{required: true, whitespace: true, message: '请输入组!'}]}>
          <Input placeholder={'组'}>
          </Input>
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
