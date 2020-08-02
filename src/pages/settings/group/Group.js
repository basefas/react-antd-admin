import React, {Component, Fragment} from 'react';
import {Button, Card, Col, Divider, message, Row, Table, Tree} from 'antd';
import {DownOutlined, PlusOutlined} from "@ant-design/icons";
import {createGroup, deleteGroup, groupList, updateGroup} from "./service";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import DeleteForm from "./components/DeleteForm";
import moment from "moment";

const {DirectoryTree} = Tree

class Group extends Component {
  state = {
    groups: [],
    groupsSelect: [],
    groupsTree: [],
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
        title: '人数',
        dataIndex: 'head_count',
        key: 'head_count',
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
      const groupsSelect = res.data.map(i => {
        return {id: i.id, name: i.name, parent_id: i.parent_id}
      });
      groupsSelect.push({id: 0, name: "根目录"});
      this.setState(
        {
          groups: res.data,
          groupsSelect: groupsSelect,
          groupsTree: this.convertToGroupsTree(res.data),
        }
      );
    } else {
      message.error('获取组列表失败。')
    }
  };

  convertToGroupsTree = (groups) => {
    const formatGroups = groups.map(i => {
      return {key: i.id, title: i.name, parent_id: i.parent_id}
    });

    const res = [];
    const temp = formatGroups.reduce((res, group) => {
      res[group.key] = group;
      return res
    }, {});

    for (const group of formatGroups) {
      if (group.parent_id === 0) {
        res.push(group);
      }
      if (group.parent_id in temp) {
        const parent = temp[group.parent_id];
        parent.children = parent.children || [];
        parent.children.push(group);
      }
    }
    this.addIsLeaf(res)
    return res;
  };

  addIsLeaf = (groups) => {
    for (const group of groups) {
      if (group.children === undefined) {
        group.isLeaf = true
      } else {
        group.isLeaf = false
        this.addIsLeaf(group.children)
      }
    }
  }

  handleCreateModalVisible = (visible) => {
    this.setState({
      createModalVisible: visible,
    });
  };

  handleUpdateModalVisible = (visible, group) => {
    if (group !== undefined) {
      this.updateGroup = group;
    }
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
      message.error("创建组失败");
    }
  };

  handleUpdateGroup = async (groupID, group) => {
    const res = await updateGroup(groupID, group);
    if (res.code === 0) {
      this.handleUpdateModalVisible(false);
      this.getGroupList()
    } else {
      message.error("修改组信息失败");
    }
  };

  handleDeleteGroup = async (groupID) => {
    const res = await deleteGroup(groupID);
    if (res.code === 0) {
      this.handleDeleteModalVisible(false);
      this.getGroupList()
    } else {
      message.error("删除组失败");
    }
  };

  onSelect = () => {
  };

  render() {
    const title = '组';
    const {
      groups, groupsSelect, groupsTree, loading,
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
        <Row gutter={8}>
          <Col flex="300px">
            <Card
              title={'组织结构'}
              bodyStyle={{padding: "0"}}
            >
              <DirectoryTree
                switcherIcon={<DownOutlined/>}
                showIcon={false}
                onSelect={this.onSelect}
                treeData={groupsTree}
              />
            </Card>
          </Col>
          <Col flex="auto"> <Card title={title} extra={addGroup}>
            <div>
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
            </div>
          </Card>
          </Col>
        </Row>

        {createModalVisible ?
          <CreateForm {...createMethods}
                      createModalVisible={createModalVisible}
                      groupsSelect={groupsSelect}/> : null}
        {updateModalVisible ?
          <UpdateForm {...updateMethods}
                      updateModalVisible={updateModalVisible}
                      group={updateGroup}
                      groups={groups}
                      groupsSelect={groupsSelect}/> : null}
        {deleteModalVisible ?
          <DeleteForm {...deleteMethods}
                      deleteModalVisible={deleteModalVisible}
                      group={deleteGroup}/> : null}
      </div>
    );
  }
}

export default Group;
