import React, { FC, Fragment, useEffect, useState } from 'react';
import { Badge, Button, Card, Divider, message, Modal, Table } from "antd";
import { userList, updateUser, createUser, deleteUser } from "./service";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { UserCreateInfo, UserListItem, UserUpdateInfo } from "./data";
import { ColumnsType } from "antd/es/table";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";

const {confirm} = Modal;

const User: FC = () => {
  const [users, setUsers] = useState<UserListItem[]>([])
  const [userUpdate, setUserUpdate] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [updateFormVisible, setUpdateFormVisible] = useState(false)
  const title = '用户列表';

  const getUserList = async () => {
    const result = await userList();
    setUsers(result.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getUserList().then();
  }, []);

  const handleSwitchUserState = async (user: UserListItem) => {
    const result = await updateUser(user.id, {
      status: user.status === 1 ? 2 : 1
    } as UserUpdateInfo);
    if (result.code === 0) {
      getUserList().then()
    } else {
      message.error("修改用户状态失败");
    }
  };

  const handleCreateUser = async (user: UserCreateInfo) => {
    const result = await createUser(user);
    if (result.code === 0) {
      setCreateFormVisible(false)
      getUserList().then()
      message.success("创建成功");
    } else {
      message.error("创建用户失败");
    }
  };

  const handleUpdateUser = async (id: number, user: UserUpdateInfo) => {
    const result = await updateUser(id, user);
    if (result.code === 0) {
      setUpdateFormVisible(false);
      getUserList().then()
    } else {
      message.error("修改用户信息失败");
    }
  };

  const handleDeleteUser = async (id: number) => {
    const result = await deleteUser(id);
    if (result.code === 0) {
      getUserList().then()
    } else {
      message.error("删除用户失败");
    }
  };

  const addUser = (
    <Button type="primary" onClick={() => setCreateFormVisible(true)}>
      <PlusOutlined/>添加
    </Button>
  )

  function deleteModal(user: UserListItem) {
    confirm({
      title: '确定删除用户 ' + user.username + ' ?',
      icon: <ExclamationCircleOutlined/>,
      onOk() {
        handleDeleteUser(user.id).then()
      },
    });
  }

  const columns: ColumnsType<UserListItem> = [
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
      render: (status: number) => {
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
      render: (user: UserListItem) => (
        <Fragment>
          <Button type="link"
                  size={"small"}
                  onClick={() => handleSwitchUserState(user)}>{user.status === 1 ? "禁用" : "启用"}</Button>
          <Divider type="vertical"/>
          <Button type="link"
                  size={"small"}
                  onClick={() => {
                    setUpdateFormVisible(true);
                    setUserUpdate(user)
                  }}
          >编辑</Button>
          <Divider type="vertical"/>
          <Button type="link"
                  size={"small"}
                  onClick={() => deleteModal(user)}
          >删除</Button>
        </Fragment>
      ),
    },
  ];

  return (
    <div>
      <Card title={title} extra={addUser}>
        <Table
          columns={columns}
          dataSource={users}
          rowKey={users => users.id}
          loading={loading}
          pagination={{
            hideOnSinglePage: true,
            pageSize: 10
          }}
        />
      </Card>
      {createFormVisible ?
        <CreateForm
          visible={createFormVisible}
          onOk={handleCreateUser}
          onCancel={() => {
            setCreateFormVisible(false)
          }}
        /> : null}
      {updateFormVisible ?
        <UpdateForm
          visible={updateFormVisible}
          user={userUpdate}
          onOk={handleUpdateUser}
          onCancel={() => {
            setUpdateFormVisible(false)
          }}
        /> : null}
    </div>
  );
}
export default User;
