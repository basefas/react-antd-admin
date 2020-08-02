import React, {Component} from 'react';
import {TreeSelect, Form, Input, Modal, Select, InputNumber} from 'antd';
import {icons, menuIcons} from "../../../../utils/icons";

const {Item} = Form;
const {Option} = Select;

class UpdateForm extends Component {
  formRef = React.createRef();

  okHandle = () => {
    this.formRef.current.validateFields()
      .then(menu => {
        if (this.props.modalType === 1) {
          if (menu.menu_type === 1) {
            menu.method = '-'
          }
          if (menu.menu_type === 2) {
            menu.method = 'GET'
          }
        }
        if (this.props.modalType === 2) {
          menu.menu_type = 3
          menu.icon = ''
        }
        this.props.handleUpdateMenu(this.props.menu.id, menu)
      })
  };

  cancelHandle = () => {
    this.props.handleUpdateModalVisible(false)
  };

  render() {
    const {updateModalVisible, menusSelect, menu, modalType} = this.props;
    return (
      <Modal
        title={(modalType === 1) ? "修改菜单" : "修改功能"}
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={this.cancelHandle}
        destroyOnClose={true}
      >
        <Form ref={this.formRef} initialValues={menu}>
          <Item name="parent_id"
                label="上级"
                rules={[
                  {required: true},
                  ({getFieldValue}) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('parent_id') !== menu.id) {
                        return Promise.resolve();
                      }
                      return Promise.reject('上级不能选择自己');
                    },
                  }),
                ]}
          >
            <TreeSelect
              switcherIcon={icons['DownOutlined']}
              placeholder={"请选择父节点"}
              treeData={menusSelect}
            />
          </Item>
          {modalType === 1 ? (
            <Item name="menu_type"
                  label="类型"
                  rules={[
                    {required: true},
                  ]}
            >
              <Select
                placeholder={"请选择菜单类型"}
              >
                <Option key={1} value={1}>{'目录'}</Option>
                <Option key={2} value={2}>{'菜单'}</Option>
              </Select>
            </Item>
          ) : null}
          <Item name="name"
                label="名称"
                rules={[
                  {required: true, whitespace: true, message: '请输入菜单名称!'},
                ]}
          >
            <Input placeholder={'菜单名称'}>
            </Input>
          </Item>
          <Item name="path"
                label="路径"
                rules={[
                  {required: true, whitespace: true, message: '请输入路径!'},
                ]}
          >
            <Input placeholder={'路径'}>
            </Input>
          </Item>
          {modalType === 1 ? (
            <Item name="icon"
                  label="图标"
                  rules={[
                    {required: true},
                  ]}
            >
              <Select onChange={this.handleChange}
                      placeholder={"请选择图标"}
              >
                {
                  Object.keys(menuIcons).map(i => {
                    return (<Option key={i} value={i}>{menuIcons[i]}</Option>)
                  })
                }
              </Select>
            </Item>
          ) : null}
          {modalType === 1 ? (
            <Item name="order_id"
                  label="排序"
                  rules={[
                    {required: true, type: 'number', whitespace: true, message: '请输入排序值!'},
                  ]}
            >
              <InputNumber
                placeholder={'排序值'}
                style={{width: '100%' }}
              />
            </Item>
          ) : null}
          {modalType === 2 ? (
            <Item name="method"
                  label="方法"
                  rules={[
                    {required: true},
                  ]}
            >
              <Select
                placeholder={"请选择方法"}
              >
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
}

export default UpdateForm;
