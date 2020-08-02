import React, {Component} from 'react';
import {Form, Input, Modal, Select} from 'antd';

const {Item} = Form;
const {Option} = Select;

class UpdateForm extends Component {
  formRef = React.createRef();

  constructor(props) {
    super(props);
    this.state = {
      groups: props.groupsSelect
    }
  }

  okHandle = () => {
    this.formRef.current.validateFields()
      .then(group => {
        this.props.handleUpdateGroup(this.props.group.id, group)
      })
  };

  cancelHandle = () => {
    this.props.handleUpdateModalVisible(false)
  };

  handleChange(value) {
  }

  render() {
    const {updateModalVisible, group, groupsSelect} = this.props;

    const form_layout = {
      labelCol: { span: 4 },
    };

    return (
      <Modal
        title="修改组信息"
        visible={updateModalVisible}
        onOk={this.okHandle}
        onCancel={this.cancelHandle}
        destroyOnClose={true}
      >
        <Form ref={this.formRef}
              initialValues={group}
              {...form_layout}
              size="middle"
        >
          <Item name="name"
                label="名称"
                rules={[
                  {required: true, whitespace: true, message: '请输入组!'},
                ]}
          >
            <Input placeholder={'组'}>
            </Input>
          </Item>
          <Item name="parent_id"
                label="父节点"
                rules={[
                  {required: true},
                ]}
          >
            <Select onChange={this.handleChange}
                    placeholder={"请选择父节点"}
            >
              {groupsSelect.map(g => {
                return (<Option key={g.id} value={g.id}>{g.name}</Option>)
              })}
            </Select>
          </Item>
        </Form>
      </Modal>
    )
  }
}

export default UpdateForm;
