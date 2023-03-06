import React, { FC, Fragment, useEffect, useState } from 'react';
import { Button, Card, Divider, message, Modal, Table } from "antd";
import { GroupCreateInfo, GroupListItem, GroupUpdateInfo } from "./data";
import { createGroup, deleteGroup, groupList, updateGroup } from "./service";
import { ColumnsType } from "antd/es/table";
import moment from 'moment';
import { ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";

const {confirm} = Modal;

const Group: FC = () => {
  const [groups, setGroups] = useState<GroupListItem[]>([])
  const [groupUpdate, setGroupUpdate] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [updateFormVisible, setUpdateFormVisible] = useState(false)
  const title = '分组';

  const getGroupList = async () => {
    const result = await groupList();
    setGroups(result.data);
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    getGroupList().then();
  }, []);

  const formatTime = (date: any) => {
    return date ? moment(date).format('YYYY-MM-DD HH:mm') : ''
  };

  const handleCreateGroup = async (group: GroupCreateInfo) => {
    const result = await createGroup(group);
    if (result.code === 0) {
      setCreateFormVisible(false)
      getGroupList().then()
    } else {
      message.error("创建分组失败");
    }
  };

  const handleUpdateGroup = async (id: number, group: GroupUpdateInfo) => {
    const result = await updateGroup(id, group);
    if (result.code === 0) {
      setUpdateFormVisible(false);
      getGroupList().then()
    } else {
      message.error("修改分组失败");
    }
  };

  const handleDeleteGroup = async (id: number) => {
    const result = await deleteGroup(id);
    if (result.code === 0) {
      getGroupList().then()
    } else {
      message.error("删除分组失败");
    }
  };

  const addGroup = (
    <Button type="primary"
            onClick={() => setCreateFormVisible(true)}
    >
      <PlusOutlined />添加
    </Button>
  )

  function deleteModal(group: GroupListItem) {
    confirm({
      title: '确定删除分组 ' + group.name + ' ?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDeleteGroup(group.id).then()
      },
    });
  }

  const columns: ColumnsType<GroupListItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
    },
    {
      title: '分组',
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
      render: (group) => (
        <Fragment>
          <Button type="link"
                  size={"small"}
                  onClick={() => {
                    setUpdateFormVisible(true);
                    setGroupUpdate(group)
                  }}>编辑</Button>
          <Divider type="vertical" />
          <Button type="link"
                  size={"small"}
                  onClick={() => deleteModal(group)}
          >删除</Button>
        </Fragment>
      ),
    },
  ];

  return (
    <div>
      <Card title={title} extra={addGroup}>
        <Table
          columns={columns}
          dataSource={groups}
          rowKey={groups => groups.id}
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
          onOk={handleCreateGroup}
          onCancel={() => {
            setCreateFormVisible(false)
          }}
        /> : null}

      {updateFormVisible ?
        <UpdateForm
          open={updateFormVisible}
          group={groupUpdate}
          onOk={handleUpdateGroup}
          onCancel={() => {
            setUpdateFormVisible(false)
          }}
        /> : null}
    </div>
  );
}
export default Group;
