import React, {Component, Fragment} from 'react';
import {Card, Table, Button, Divider, message, Row, Col, Tree} from 'antd';
import {menuList, createMenu, updateMenu, deleteMenu, menuGet} from "./service";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";
import DeleteForm from "./components/DeleteForm";
import {icons, menuIcons} from "../../../utils/icons";

const {DirectoryTree} = Tree

class Menu extends Component {
  state = {
    menusSelect: [],
    menusTree: [],
    funsTree: [],
    selectedMenu: [],
    loading: false,
    modalType: 0,
    menuType: false,
    createModalVisible: false,
    updateModalVisible: false,
    deleteModalVisible: false,
    menuTitle: ""
  };

  constructor(props) {
    super(props);
    this.initColumns();
  }

  componentDidMount() {
    this.getMenuList()
  }

  initColumns = () => {
    this.menuColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 160,
      },
      {
        title: '路径',
        dataIndex: 'path',
        key: 'path',
        align: 'center',
        width: 240,
      },
      {
        title: '图标',
        dataIndex: 'icon',
        key: 'icon',
        align: 'center',
        width: 100,
        render: (icon) => {
          return menuIcons[icon]
        }
      },
      {
        title: '排序',
        dataIndex: 'order_id',
        key: 'order_id',
        align: 'center',
        width: 100,
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (menu) => (
          <Fragment>
            <Button type="link"
                    onClick={() => this.handleUpdateModalVisible(true, menu, 1)}>编辑</Button>
            <Divider type="vertical"/>
            <Button type="link"
                    onClick={() => this.handleDeleteModalVisible(true, menu)}>删除</Button>
          </Fragment>
        ),
      },
    ];
    this.funColumns = [
      {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        align: 'center',
        width: 100,
      },
      {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        align: 'center',
        width: 160,
      },
      {
        title: '路径',
        dataIndex: 'path',
        key: 'path',
        align: 'center',
        width: 240,
      },
      {
        title: '方法',
        dataIndex: 'method',
        key: 'method',
        align: 'center',
        width: 100,
      },
      {
        title: '操作',
        key: 'action',
        align: 'center',
        render: (menu) => (
          <Fragment>
            <Button type="link"
                    size={"small"}
                    onClick={() => this.handleUpdateModalVisible(true, menu, 2)}>编辑</Button>
            <Divider type="vertical"/>
            <Button type="link"
                    size={"small"}
                    onClick={() => this.handleDeleteModalVisible(true, menu)}>删除</Button>
          </Fragment>
        ),
      },
    ];
  };

  getMenu = async (id) => {
    const res = await menuGet(id);
    if (res.code === 0) {
      const menu = [];
      menu.push(res.data)
      this.setState(
        {
          selectedMenu: menu,
          funsTree: res.data.funs
        }
      )
    } else {
      message.error(res.message)
    }
  };

  getMenuList = async () => {
    this.setState({
      loading: true
    });
    const res = await menuList();
    this.setState({
      loading: false
    });
    if (res.code === 0) {
      const menusTree = this.convertMenusTree(res.data)
      const menusSelect = JSON.parse(JSON.stringify(menusTree))
      menusSelect.push({key: 0, id: 0, title: "根目录", menu_type: 1, children: []})
      this.setState(
        {
          menusTree: menusTree,
          menusSelect: menusSelect,
        }
      )
    } else {
      message.error('获取菜单列表失败。')
    }
  };

  convertMenusTree = (menus) => {
    const formatMenus = [];

    for (const menu of menus) {
      formatMenus.push({
        key: menu.id,
        id: menu.id,
        value: menu.id,
        name: menu.name,
        title: menu.name,
        path: menu.path || "",
        method: menu.method || "",
        menu_type: menu.menu_type || 1,
        isLeaf: menu.menu_type === 2 || false,
        icon: menu.icon || "",
        parent_id: menu.parent_id || 0,
        order_id: menu.order_id || 0,
        children: this.convertMenusTree(menu.children) || [],
        funs: menu.funs || []
      })
    }
    return formatMenus
  }

  handleCreateModalVisible = (visible, modalType) => {
    this.setState({
      createModalVisible: visible,
      modalType: modalType
    });
  };

  handleUpdateModalVisible = (visible, menu, modalType) => {
    this.updateMenu = menu;
    this.setState({
      updateModalVisible: visible,
      modalType: modalType
    });
  };

  handleDeleteModalVisible = (visible, menu) => {
    this.deleteMenu = menu;
    this.setState({
      deleteModalVisible: visible,
    });
  };

  handleCreateMenu = async (menu) => {
    const res = await createMenu(menu);
    if (res.code === 0) {
      this.handleCreateModalVisible(false);
      this.getMenuList()
      if (this.state.selectedMenu[0] !== undefined) {
        this.getMenu(this.state.selectedMenu[0].id)
      }
    } else {
      message.error(res.message);
    }
  };

  handleUpdateMenu = async (id, menu) => {
    const res = await updateMenu(id, menu);
    if (res.code === 0) {
      this.handleUpdateModalVisible(false);
      this.getMenuList()
      this.getMenu(this.state.selectedMenu[0].id)
    } else {
      message.error("修改菜单信息失败: ", res.message);
    }
  };

  handleDeleteMenu = async (id) => {
    const res = await deleteMenu(id);
    if (res.code === 0) {
      this.handleDeleteModalVisible(false);
      this.getMenuList()
      this.getMenu(this.state.selectedMenu[0].id)
    } else {
      message.error("删除菜单失败");
    }
  };

  onSelect = (value, event) => {
    const title = event.node.menu_type === 1 ? '目录' : '菜单'
    this.setState({
      menuTitle: title,
      menuType: event.node.isLeaf
    })
    this.getMenu(value)
  };

  render() {
    const {
      menusSelect, menusTree, funsTree, loading, selectedMenu, menuTitle,
      modalType, menuType, createModalVisible, updateModalVisible, deleteModalVisible,
    } = this.state;
    const funTitle = '功能';
    const updateMenu = this.updateMenu;
    const deleteMenu = this.deleteMenu;
    const createMenu = selectedMenu.length !== 0 ? {parent_id: selectedMenu[0].id} : {parent_id: 0}

    const createMethods = {
      handleCreateMenu: this.handleCreateMenu,
      handleCreateModalVisible: this.handleCreateModalVisible,
    };

    const updateMethods = {
      handleUpdateMenu: this.handleUpdateMenu,
      handleUpdateModalVisible: this.handleUpdateModalVisible,
    };

    const deleteMethods = {
      handleDeleteMenu: this.handleDeleteMenu,
      handleDeleteModalVisible: this.handleDeleteModalVisible,
    };

    const addMenu = (
      <Button type="primary"
              onClick={() => this.handleCreateModalVisible(true, 1)}
      >
        {icons['PlusOutlined']}添加
      </Button>
    );

    const addFun = (
      <Button type="primary"
              onClick={() => this.handleCreateModalVisible(true, 2)}
      >
        {icons['PlusOutlined']}添加
      </Button>
    );

    return (
      <div>
        <Row gutter={8}>
          <Col flex="300px">
            <Card
              title={'菜单管理'}
            >
              <DirectoryTree
                switcherIcon={icons['DownOutlined']}
                showIcon={false}
                onSelect={this.onSelect}
                treeData={menusTree}
              />
            </Card>
          </Col>
          <Col flex="auto">
            <div>
              <Card title={menuTitle} extra={addMenu}>
                <Table
                  columns={this.menuColumns}
                  dataSource={selectedMenu}
                  rowKey={selectedMenu => selectedMenu.id}
                  loading={loading}
                  size={'middle'}
                  pagination={{
                    hideOnSinglePage: true,
                    pageSize: 10
                  }}
                  childrenColumnName={[]}
                />
              </Card>
              {menuType ? <Card title={funTitle} extra={addFun} style={{marginTop: "8px"}}>
                <Table
                  columns={this.funColumns}
                  dataSource={funsTree}
                  rowKey={funsTree => funsTree.id}
                  loading={loading}
                  size={'small'}
                  pagination={{
                    hideOnSinglePage: true,
                    pageSize: 10
                  }}
                  childrenColumnName={[]}
                />
              </Card> : null}
            </div>
          </Col>
        </Row>
        {createModalVisible ?
          <CreateForm {...createMethods}
                      createModalVisible={createModalVisible}
                      modalType={modalType}
                      menu={createMenu}
                      menusSelect={menusSelect}/> : null}
        {updateModalVisible ?
          <UpdateForm {...updateMethods}
                      updateModalVisible={updateModalVisible}
                      modalType={modalType}
                      menu={updateMenu}
                      menusSelect={menusSelect}/> : null}
        {deleteModalVisible ?
          <DeleteForm {...deleteMethods}
                      deleteModalVisible={deleteModalVisible}
                      menu={deleteMenu}/> : null}
      </div>
    );
  }
}

export default Menu;
