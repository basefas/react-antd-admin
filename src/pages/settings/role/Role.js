import React, {Component, Fragment} from 'react';
import {Card, Table, Button, Divider, message} from 'antd';
import {PlusOutlined} from "@ant-design/icons";
import {roleList, createRole, updateRole, deleteRole, updateRoleMenus} from "./service";
import {menuList} from "../menu/service";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import DeleteForm from "./components/DeleteForm";
import PermissionForm from "./components/PermissionForm";
import moment from "moment";

class Role extends Component {
  state = {
    roles: [],
    menus: [],
    loading: false,
    createModalVisible: false,
    updateModalVisible: false,
    deleteModalVisible: false,
    permissionModalVisible: false,
  };

  constructor(props) {
    super(props);
    this.initColumns();
  }

  componentDidMount() {
    this.getRoleList()
    this.getMenuList()
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
        title: '角色',
        dataIndex: 'name',
        key: 'name',
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
        render: (role) => (
          <Fragment>
            <Button type="link"
                    size={"small"}
                    onClick={() => this.handleUpdateModalVisible(true, role)}>编辑</Button>
            <Divider type="vertical"/>
            <Button type="link"
                    size={"small"}
                    onClick={() => this.handlePermissionModalVisible(true, role)}>权限设置</Button>
            <Divider type="vertical"/>
            <Button type="link"
                    size={"small"}
                    onClick={() => this.handleDeleteModalVisible(true, role)}>删除</Button>
          </Fragment>
        ),
      },
    ];
  };

  getRoleList = async () => {
    this.setState({
      loading: true
    });
    const res = await roleList();
    this.setState({
      loading: false
    });
    if (res.code === 0) {
      this.setState(
        {
          roles: res.data,
        }
      )
    } else {
      message.error('获取角色列表失败。')
    }
  };

  getMenuList = async () => {
    const res = await menuList();
    if (res.code === 0) {
      this.setState({
        menus: res.data
      })
    } else {
      message.error('获取菜单列表失败。')
    }
  };

  handleCreateModalVisible = (visible) => {
    this.setState({
      createModalVisible: visible,
    });
  };

  handleUpdateModalVisible = (visible, role) => {
    this.updateRole = role;
    this.setState({
      updateModalVisible: visible,
    });
  };

  handleDeleteModalVisible = (visible, role) => {
    this.deleteRole = role;
    this.setState({
      deleteModalVisible: visible,
    });
  };

  handlePermissionModalVisible = (visible, role) => {
    this.permissionRole = role;
    this.setState({
      permissionModalVisible: visible,
    });
  };

  handleCreateRole = async (role) => {
    const res = await createRole(role);
    if (res.code === 0) {
      this.handleCreateModalVisible(false);
      this.getRoleList()
    } else {
      message.error("创建角色失败");
    }
  };

  handleUpdateRole = async (id, role) => {
    const res = await updateRole(id, role);
    if (res.code === 0) {
      this.handleUpdateModalVisible(false);
      this.getRoleList()
    } else {
      message.error("修改角色信息失败");
    }
  };

  handleDeleteRole = async (id) => {
    const res = await deleteRole(id);
    if (res.code === 0) {
      this.handleDeleteModalVisible(false);
      this.getRoleList()
    } else {
      message.error("删除角色失败");
    }
  };

  handleUpdatePermission = async (id, menus) => {
    const res = await updateRoleMenus(id, menus);
    if (res.code === 0) {
      this.handlePermissionModalVisible(false);
      message.success("修改成功");
    } else {
      message.error("修改权限失败");
    }
  };

  render() {
    const title = '角色';
    const {
      roles, menus, loading,
      createModalVisible, updateModalVisible, deleteModalVisible, permissionModalVisible
    } = this.state;
    const updateRole = this.updateRole;
    const deleteRole = this.deleteRole;
    const permissionRole = this.permissionRole;

    const createMethods = {
      handleCreateRole: this.handleCreateRole,
      handleCreateModalVisible: this.handleCreateModalVisible,
    };

    const updateMethods = {
      handleUpdateRole: this.handleUpdateRole,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };

    const deleteMethods = {
      handleDeleteRole: this.handleDeleteRole,
      handleDeleteModalVisible: this.handleDeleteModalVisible,
    };

    const permissionMethods = {
      handleUpdatePermission: this.handleUpdatePermission,
      handlePermissionModalVisible: this.handlePermissionModalVisible,
    };

    const addRole = (
      <Button type="primary"
              onClick={() => this.handleCreateModalVisible(true)}
      >
        <PlusOutlined/>添加
      </Button>
    );

    return (
      <div>
        <Card title={title} extra={addRole}>
          <Table
            columns={this.columns}
            dataSource={roles}
            rowKey={roles => roles.id}
            loading={loading}
            pagination={{
              hideOnSinglePage: true,
              pageSize: 10
            }}
          />
        </Card>
        {createModalVisible ?
          <CreateForm {...createMethods}
                      createModalVisible={createModalVisible}/> : null}
        {updateModalVisible ?
          <UpdateForm {...updateMethods}
                      updateModalVisible={updateModalVisible}
                      role={updateRole}/> : null}
        {deleteModalVisible ?
          <DeleteForm {...deleteMethods}
                      deleteModalVisible={deleteModalVisible}
                      role={deleteRole}/> : null}
        {permissionModalVisible ?
          <PermissionForm {...permissionMethods}
                          permissionModalVisible={permissionModalVisible}
                          menus={menus}
                          role={permissionRole}/> : null}
      </div>
    );
  }
}

export default Role;
