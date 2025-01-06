import { FC } from 'react';
import { Form, Input, Modal } from 'antd';
import { RoleListItem, RoleUpdateInfo } from "../data";

const {Item} = Form;

interface UpdateFormProps {
  open: boolean;
  role: RoleListItem;
  onOk: (id: number, user: RoleUpdateInfo) => void;
  onCancel: () => void;
}

const UpdateForm: FC<UpdateFormProps> = (props) => {
  const {open, role, onOk, onCancel} = props
  const [form] = Form.useForm();

  const ok = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        onOk(role.id, values);
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
      open={open}
      onOk={ok}
      onCancel={onCancel}
      destroyOnClose={true}
    >
      <Form{...form_layout} form={form} initialValues={role}>
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
export default UpdateForm;
