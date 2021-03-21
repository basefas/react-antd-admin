import React, { FC } from 'react';
import { Form, Input, InputNumber, Modal, Select, TreeSelect } from 'antd';
import { MenuCreateInfo } from "../data";
import { menuIcons } from "../../../../utils/icons";
import { DataNode } from "antd/lib/tree";
import { DownOutlined } from "@ant-design/icons";

const {Item} = Form;
const {Option} = Select;

interface CreateFormProps {
  visible: boolean;
  menusSelect: DataNode[];
  menu: DataNode;
  formType: number;
  onOk: (menu: MenuCreateInfo) => void;
  onCancel: () => void;
}

const CreateForm: FC<CreateFormProps> = (props) => {
  const {visible, menusSelect, menu, formType, onOk, onCancel} = props
  const [form] = Form.useForm();
  const ok = () => {
    form
      .validateFields()
      .then(values => {
        form.resetFields();
        if (formType === 1) {
          if (values.menu_type === 1) {
            values.method = '-'
          }
          if (values.menu_type === 2) {
            values.method = 'GET'
          }
          if (values.parent_id === 0) {
            values.menu_type = 1
          }
        }
        if (formType === 2) {
          values.menu_type = 3
          values.icon = ''
        }
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
      title={(formType === 1) ? "添加菜单" : "添加功能"}
      visible={visible}
      onOk={ok}
      onCancel={onCancel}
      destroyOnClose={true}>
      <Form{...form_layout} form={form}
           initialValues={{parent_id: menu.key}}
      >
        <Item name="parent_id" label="上级" rules={[{required: true}]}>
          <TreeSelect
            switcherIcon={<DownOutlined/>}
            placeholder={"请选择父节点"}
            treeData={menusSelect}/>
        </Item>
        {formType === 1 ? (
          <Item name="menu_type" label="类型" rules={[{required: true}]}>
            <Select placeholder={"请选择菜单类型"}>
              <Option key={1} value={1}>{'目录'}</Option>
              <Option key={2} value={2}>{'菜单'}</Option>
            </Select>
          </Item>
        ) : null}
        <Item name="name" label="名称" rules={[{required: true, whitespace: true, message: '请输入菜单名称!'}]}>
          <Input placeholder={'菜单名称'}/>
        </Item>
        <Item name="path" label="路径" rules={[{required: true, whitespace: true, message: '请输入路径!'}]}>
          <Input placeholder={'路径'}/>
        </Item>
        {formType === 1 ? (
          <Item name="icon" label="图标" rules={[{required: true}]}>
            <Select placeholder={"请选择图标"}>
              {Object.keys(menuIcons).map(i => {
                return (<Option key={i} value={i}>{menuIcons[i]}</Option>)
              })}
            </Select>
          </Item>
        ) : null}
        {formType === 1 ? (
          <Item name="order_id" label="排序"
                rules={[{required: true, type: 'number', whitespace: true, message: '请输入排序值!'}]}>
            <InputNumber placeholder={'排序值'} style={{width: '100%'}}/>
          </Item>
        ) : null}
        {formType === 2 ? (
          <Item name="method" label="方法" rules={[{required: true}]}>
            <Select placeholder={"请选择方法"}>
              <Option key={1} value={'*'}>{'ALL'}</Option>
              <Option key={2} value={'POST'}>{'POST'}</Option>
              <Option key={3} value={'GET'}>{'GET'}</Option>
              <Option key={4} value={'PUT'}>{'PUT'}</Option>
              <Option key={5} value={'DELETE'}>{'DELETE'}</Option>
            </Select>
          </Item>
        ) : null}
      </Form>
    </Modal>
  )
}
export default CreateForm;
