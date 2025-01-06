import { FC, useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { roleList } from "../../role/service";
import { GroupCreateInfo } from "../data";
import { RoleListItem } from "../../role/data";

const {Item} = Form;
const {Option} = Select;

interface CreateFormProps {
  open: boolean;
  onOk: (user: GroupCreateInfo) => void;
  onCancel: () => void;
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const {open, onOk, onCancel} = props
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
      title="添加分组"
      open={open}
      onOk={ok}
      onCancel={onCancel}
      destroyOnClose={true}
    >
      <Form{...form_layout} form={form}>
        <Item name="name"
              label="名称"
              rules={[
                {required: true, whitespace: true, message: '请输入分组名称!'},
              ]}>
          <Input placeholder={'分组名称'}>
          </Input>
        </Item>
        <Item name="role_id"
              label="角色"
              rules={[{required: true}]}>
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
