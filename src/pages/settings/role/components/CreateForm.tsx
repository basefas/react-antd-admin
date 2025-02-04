import { FC } from 'react';
import { Form, Input, Modal } from 'antd';
import { RoleCreateInfo } from "../data";

const {Item} = Form;

interface CreateFormProps {
  open: boolean;
  onOk: (role: RoleCreateInfo) => void;
  onCancel: () => void;
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const {open, onOk, onCancel} = props
  const [form] = Form.useForm();

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
      title="添加角色"
      open={open}
      onOk={ok}
      onCancel={onCancel}
      destroyOnClose={true}>
      <Form{...form_layout} form={form}>
        <Item name="name" label="角色名称" rules={[{required: true, whitespace: true, message: '请输入角色名称!'}]}>
          <Input placeholder={'角色名称'}>
          </Input>
        </Item>
      </Form>
    </Modal>
  )
}
export default CreateForm;
