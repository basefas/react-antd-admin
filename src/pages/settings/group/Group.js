import React, {Component, Fragment} from 'react';
import {Button, Card, Divider, message, Table} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import {createGroup, deleteGroup, groupList, updateGroup} from "./service";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import DeleteForm from "./components/DeleteForm";
import moment from "moment";

class Group extends Component {
  state = {
    groups: [],
    groupsSelect: [],
    loading: false,
    createModalVisible: false,
    updateModalVisible: false,
    deleteModalVisible: false,
  };

  constructor(props) {
    super(props);
    this.initColumns();
  }

  componentDidMount() {
    this.getGroupList()
  }

  formatTime = (date) => {
    return date ? moment(date).format('YYYY-MM-DD HH:mm') : ''
  };

  initColumns = () => {
    this.columns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
      },
      {
        title: '组',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
      },
      {
        title: '角色',
        dataIndex: 'role_name',
        key: 'role_name',
        align: 'center',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
        key: 'create_time',
        align: 'center',
        render: this.formatTime
      },
      {
        title: '修改时间',
        dataIndex: 'update_time',
        key: 'update_time',
        align: 'center',
        render: this.formatTime
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (group) => (
          <Fragment>
            <Button type="link"
                    size={"small"}
                    onClick={() => this.handleUpdateModalVisible(true, group)}>编辑</Button>
            <Divider type="vertical"/>
            <Button type="link"
                    size={"small"}
                    onClick={() => this.handleDeleteModalVisible(true, group)}>删除</Button>
          </Fragment>
        ),
      },
    ];
  };

  getGroupList = async () => {
    this.setState({
      loading: true
    });
    const res = await groupList();
    this.setState({
      loading: false
    });
    if (res.code === 0) {
      this.setState(
        {
          groups: res.data,
        }
      );
    } else {
      message.error(res.message);
    }
  };

  handleCreateModalVisible = (visible) => {
    this.setState({
      createModalVisible: visible,
    });
  };

  handleUpdateModalVisible = (visible, group) => {
    this.updateGroup = group;
    this.setState({
      updateModalVisible: visible,
    });
  };

  handleDeleteModalVisible = (visible, group) => {
    this.deleteGroup = group;
    this.setState({
      deleteModalVisible: visible,
    });
  };

  handleCreateGroup = async (group) => {
    const res = await createGroup(group);
    if (res.code === 0) {
      this.handleCreateModalVisible(false);
      this.getGroupList()
    } else {
      message.error(res.message);
    }
  };

  handleUpdateGroup = async (groupID, group) => {
    const res = await updateGroup(groupID, group);
    if (res.code === 0) {
      this.handleUpdateModalVisible(false);
      this.getGroupList()
    } else {
      message.error(res.message);
    }
  };

  handleDeleteGroup = async (groupID) => {
    const res = await deleteGroup(groupID);
    if (res.code === 0) {
      this.handleDeleteModalVisible(false);
      this.getGroupList()
    } else {
      message.error(res.message);
    }
  };

  render() {
    const title = '组';
    const {
      groups, loading,
      createModalVisible, updateModalVisible, deleteModalVisible,
    } = this.state;
    const updateGroup = this.updateGroup;
    const deleteGroup = this.deleteGroup;

    const createMethods = {
      handleCreateGroup: this.handleCreateGroup,
      handleCreateModalVisible: this.handleCreateModalVisible,
    };

    const updateMethods = {
      handleUpdateGroup: this.handleUpdateGroup,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };

    const deleteMethods = {
      handleDeleteGroup: this.handleDeleteGroup,
      handleDeleteModalVisible: this.handleDeleteModalVisible,
    };

    const addGroup = (
      <Button type="primary"
              onClick={() => this.handleCreateModalVisible(true)}
      >
        <PlusOutlined/>添加
      </Button>
    );

    return (
      <div>
        <Card title={title} extra={addGroup}>
          <Table
            columns={this.columns}
            dataSource={groups}
            rowKey={groups => groups.id}
            loading={loading}
            pagination={{
              hideOnSinglePage: true,
              pageSize: 10
            }}
          />
        </Card>

        {createModalVisible ?
          <CreateForm {...createMethods}
                      createModalVisible={createModalVisible}
          /> : null}
        {updateModalVisible ?
          <UpdateForm {...updateMethods}
                      updateModalVisible={updateModalVisible}
                      group={updateGroup}
                      groups={groups}
          /> : null}
        {deleteModalVisible ?
          <DeleteForm {...deleteMethods}
                      deleteModalVisible={deleteModalVisible}
                      group={deleteGroup}/> : null}
      </div>
    );
  }
}

export default Group;
