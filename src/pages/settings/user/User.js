import React, {Component, Fragment} from 'react';
import {Card, Table, Button, Divider, message, Badge} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import {userList, createUser, updateUser, deleteUser} from "./service";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import DeleteForm from "./components/DeleteForm";

class User extends Component {
  state = {
    users: [],
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
    this.getUserList()
  }

  initColumns = () => {
    this.columns = [
      {
        title: '用户 ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 96,
      },
      {
        title: '用户名',
        dataIndex: 'username',
        key: 'username',
        align: 'center',
      },
      {
        title: '姓名',
        dataIndex: 'username',
        key: 'username',
        align: 'center',
        width: 120,
      },
      {
        title: '邮箱',
        dataIndex: 'email',
        key: 'email',
        align: 'center',
      },
      {
        title: '组',
        dataIndex: 'group_name',
        key: 'group_name',
        align: 'center',
        width: 160,
      },
      {
        title: '角色',
        dataIndex: 'role_name',
        key: 'role_name',
        align: 'center',
        width: 160,
      },
      {
        title: '状态',
        dataIndex: 'status',
        key: 'status',
        align: 'center',
        width: 96,
        render: (status) => {
          if (status === 1) {
            return <Badge status="success" text="启用"/>
          } else if (status === 2) {
            return <Badge status="default" text="禁用"/>
          } else {
            return <Badge status="warning" text="未知"/>
          }
        }
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        width: 280,
        render: (user) => (
          <Fragment>
            <Button type="link"
                    size={"small"}
                    onClick={() => this.handleSwitchUserState(user.id, user.status)}>{user.status === 1 ? "禁用" : "启用"}</Button>
            <Divider type="vertical"/>
            <Button type="link"
                    size={"small"}
                    onClick={() => this.handleUpdateModalVisible(true, user)}>编辑</Button>
            <Divider type="vertical"/>
            <Button type="link"
                    size={"small"}
                    onClick={() => this.handleDeleteModalVisible(true, user)}>删除</Button>
          </Fragment>
        ),
      },
    ];
  };

  getUserList = async () => {
    this.setState({
      loading: true
    });
    const res = await userList();
    this.setState({
      loading: false
    });
    if (res.code === 0) {
      this.setState(
        {
          users: res.data,
        }
      )
    } else {
      message.error('获取用户列表失败。')
    }
  };

  handleCreateModalVisible = (visible) => {
    this.setState({
      createModalVisible: visible,
    });
  };

  handleUpdateModalVisible = (visible, user) => {
    this.updateUser = user;
    this.setState({
      updateModalVisible: visible,
    });
  };

  handleDeleteModalVisible = (visible, user) => {
    this.deleteUser = user;
    this.setState({
      deleteModalVisible: visible,
    });
  };

  handleSwitchUserState = async (id, status) => {
    let user = {};
    if (status === 1) {
      user = {"status": 2}
    } else if (status === 2) {
      user = {"status": 1}
    }
    const res = await updateUser(id, user);
    if (res.code === 0) {
      this.getUserList()
    } else {
      message.error("修改用户状态失败");
    }
  };

  handleCreateUser = async (user) => {
    const res = await createUser(user);
    if (res.code === 0) {
      this.handleCreateModalVisible(false);
      this.getUserList()
    } else {
      message.error("创建用户失败");
    }
  };

  handleUpdateUser = async (id, user) => {
    const res = await updateUser(id, user);
    if (res.code === 0) {
      this.handleUpdateModalVisible(false);
      this.getUserList()
    } else {
      message.error("修改用户信息失败");
    }
  };

  handleDeleteUser = async (id) => {
    const res = await deleteUser(id);
    if (res.code === 0) {
      this.handleDeleteModalVisible(false);
      this.getUserList()
    } else {
      message.error("删除用户失败");
    }
  };

  render() {
    const title = '用户列表';
    const {
      users, loading,
      createModalVisible, updateModalVisible, deleteModalVisible,
    } = this.state;
    const updateUser = this.updateUser;
    const deleteUser = this.deleteUser;

    const createMethods = {
      handleCreateUser: this.handleCreateUser,
      handleCreateModalVisible: this.handleCreateModalVisible,
    };

    const updateMethods = {
      handleUpdateUser: this.handleUpdateUser,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };

    const deleteMethods = {
      handleDeleteUser: this.handleDeleteUser,
      handleDeleteModalVisible: this.handleDeleteModalVisible,
    };

    const addUser = (
      <Button type="primary"
              onClick={() => this.handleCreateModalVisible(true)}
      >
        <PlusOutlined/>添加
      </Button>
    );

    return (
      <div>
        <Card title={title} extra={addUser}>
          <Table
            columns={this.columns}
            dataSource={users}
            rowKey={users => users.id}
            loading={loading}
            pagination={{
              hideOnSinglePage: true,
              pageSize: 10
            }}
          />
        </Card>
        {createModalVisible ?
          <CreateForm {...createMethods} createModalVisible={createModalVisible}/> : null}
        {updateModalVisible ?
          <UpdateForm {...updateMethods} updateModalVisible={updateModalVisible} user={updateUser}/> : null}
        {deleteModalVisible ?
          <DeleteForm {...deleteMethods} deleteModalVisible={deleteModalVisible} user={deleteUser}/> : null}
      </div>
    );
  }
}

export default User;
