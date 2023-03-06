import React, { FC, Fragment, useEffect, useState } from 'react';
import moment from "moment";
import { Button, Card, Divider, message, Modal, Table } from 'antd';
import { RoleCreateInfo, RoleListItem, RoleUpdateInfo } from "./data";
import { ColumnsType } from "antd/es/table";
import { createRole, deleteRole, roleList, updateRole, updateRoleMenus } from "./service";
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { menuList } from "../menu/service";
import { MenuListItem } from "../menu/data";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import PermissionForm from "./components/PermissionForm";

const {confirm} = Modal;

const Role: FC = () => {
  const [roles, setRoles] = useState<RoleListItem[]>([])
  const [menus, setMenus] = useState<MenuListItem[]>([])
  const [roleUpdate, setRoleUpdate] = useState<any>()
  const [rolePermission, setRolePermission] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [updateFormVisible, setUpdateFormVisible] = useState(false)
  const [permissionFormVisible, setPermissionFormVisible] = useState(false)
  const title = '角色';

  const getRoleList = async () => {
    const result = await roleList();
    setRoles(result.data);
    setLoading(false);
  };

  const getMenuList = async () => {
    const result = await menuList();
    setMenus(result.data);
  };

  useEffect(() => {
    setLoading(true)
    getRoleList().then()
    getMenuList().then()
  }, []);

  const formatTime = (date: any) => {
    return date ? moment(date).format('YYYY-MM-DD HH:mm') : ''
  };

  const handleCreateRole = async (role: RoleCreateInfo) => {
    const result = await createRole(role);
    if (result.code === 0) {
      setCreateFormVisible(false)
      getRoleList().then()
    } else {
      message.error("创建角色失败");
    }
  };

  const handleUpdateRole = async (id: number, role: RoleUpdateInfo) => {
    const result = await updateRole(id, role);
    if (result.code === 0) {
      setUpdateFormVisible(false);
      getRoleList().then()
    } else {
      message.error("更新角色失败");
    }
  };

  const handleDeleteRole = async (id: number) => {
    const result = await deleteRole(id);
    if (result.code === 0) {
      getRoleList().then()
    } else {
      message.error("删除角色失败");
    }
  };

  const handleUpdatePermission = async (id: number, checkedList: number[]) => {
    const res = await updateRoleMenus(id, checkedList);
    if (res.code === 0) {
      setPermissionFormVisible(false);
      message.success("修改成功");
    } else {
      message.success("修改失败");
    }
  };

  const addRole = (
    <Button type="primary"
            onClick={() => setCreateFormVisible(true)}>
      <PlusOutlined />添加
    </Button>
  );

  function deleteModal(role: RoleListItem) {
    confirm({
      title: '删除角色',
      content: '确定删除角色<' + role.name + '>?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDeleteRole(role.id).then()
      },
    });
  }

  const columns: ColumnsType<RoleListItem> = [
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
      render: formatTime
    },
    {
      title: '修改时间',
      dataIndex: 'update_time',
      key: 'update_time',
      align: 'center',
      render: formatTime
    },
    {
      title: '操作',
      key: 'action',
      align: 'center',
      render: (role: RoleListItem) => (
        <Fragment>
          <Button type="link"
                  size={"small"}
                  onClick={() => {
                    setUpdateFormVisible(true);
                    setRoleUpdate(role)
                  }}>编辑</Button>
          <Divider type="vertical" />
          <Button type="link"
                  size={"small"}
                  onClick={() => {
                    setPermissionFormVisible(true);
                    setRolePermission(role)
                  }}
          >权限设置</Button>
          <Divider type="vertical" />
          <Button type="link"
                  size={"small"}
                  onClick={() => deleteModal(role)}
          >删除</Button>
        </Fragment>
      ),
    },
  ];

  return (
    <div>
      <Card title={title} extra={addRole}>
        <Table
          columns={columns}
          dataSource={roles}
          rowKey={roles => roles.id}
          loading={loading}
          pagination={{
            hideOnSinglePage: true,
            pageSize: 10
          }}
        />
      </Card>
      {createFormVisible ?
        <CreateForm
          open={createFormVisible}
          onOk={handleCreateRole}
          onCancel={() => {
            setCreateFormVisible(false)
          }}
        /> : null}
      {updateFormVisible ?
        <UpdateForm
          open={updateFormVisible}
          role={roleUpdate}
          onOk={handleUpdateRole}
          onCancel={() => {
            setUpdateFormVisible(false)
          }}
        /> : null}
      {permissionFormVisible ?
        <PermissionForm
          open={permissionFormVisible}
          role={rolePermission}
          menus={menus}
          onOk={handleUpdatePermission}
          onCancel={() => {
            setPermissionFormVisible(false)
          }}
        /> : null}
    </div>
  );
}
export default Role;
