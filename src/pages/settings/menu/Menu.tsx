import React, { FC, Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Divider, message, Modal, Row, Table, Tree } from "antd";
import { MenuCreateInfo, MenuListItem, MenuUpdateInfo } from "./data";
import { DataNode } from 'antd/lib/tree';
import { createMenu, deleteMenu, menuGet, menuList, updateMenu } from "./service";
import { menuIcons } from "../../../utils/icons";
import { ColumnsType } from "antd/es/table";
import { DownOutlined, ExclamationCircleOutlined, PlusOutlined } from "@ant-design/icons";
import CreateForm from "./components/CreateForm";
import UpdateForm from "./components/UpdateForm";


const {DirectoryTree} = Tree;
const {confirm} = Modal;

const Menu: FC = () => {
  const [menusSelect, setMenusSelect] = useState<DataNode[]>([])
  const [menusTree, setMenusTree] = useState<DataNode[]>([])
  const [selectedMenu, setSelectedMenu] = useState<MenuListItem[]>([])
  const [selectedFuns, setSelectedFuns] = useState<MenuListItem[]>([])
  const [menuCreate, setMenuCreate] = useState<DataNode>({key: 0})
  const [menuUpdate, setMenuUpdate] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [createFormVisible, setCreateFormVisible] = useState(false)
  const [updateFormVisible, setUpdateFormVisible] = useState(false)
  const [formType, setFormType] = useState(0)
  const [menuType, setMenuType] = useState(0)
  const funTitle = '功能';
  const treeTitle = '菜单管理';

  const getMenuList = async () => {
    setLoading(true)
    const result = await menuList();
    if (result.code === 0) {
      const mt = convertMenusTree(result.data)
      setMenusTree(mt)
      let ms = setSelectable(mt)
      ms.push({key: 0, value: 0, title: "根目录", disabled: false})
      setMenusSelect(ms)
      setLoading(false);
    }
  };

  const getMenu = async (id: number) => {
    const result = await menuGet(id);
    if (result.code === 0) {
      let menu = []
      menu.push(result.data)
      setSelectedMenu(menu);
      setSelectedFuns(result.data.funs);
    }
  };

  useEffect(() => {
    getMenuList().then()
    // eslint-disable-next-line
  }, []);

  const convertMenusTree = (menus: MenuListItem[]): DataNode[] => {
    return menus.map((menu) => ({
      key: menu.id,
      title: menu.name,
      isLeaf: menu.type === 2,
      children: menu.children && convertMenusTree(menu.children),
    } as DataNode));
  }

  const setSelectable = (menus: DataNode[]): any[] => {
    return menus.map(({isLeaf, key, children, ...item}) => ({
      ...item,
      disabled: isLeaf,
      value: key,
      key: key,
      children: children && setSelectable(children),
    }));
  }

  const handleCreateMenu = async (menu: MenuCreateInfo) => {
    const result = await createMenu(menu);
    if (result.code === 0) {
      setCreateFormVisible(false)
      getMenuList().then()
      getMenu(selectedMenu[0].id).then()
      message.success("创建成功");
    } else {
      message.error("创建菜单失败");
    }
  };

  const handleUpdateMenu = async (id: number, menu: MenuUpdateInfo) => {
    const result = await updateMenu(id, menu);
    if (result.code === 0) {
      setUpdateFormVisible(false);
      getMenuList().then()
      getMenu(selectedMenu[0].id).then()
    } else {
      message.error("修改菜单信息失败");
    }
  };

  const handleDeleteMenu = async (id: number) => {
    const result = await deleteMenu(id);
    if (result.code === 0) {
      getMenuList().then()
      getMenu(selectedMenu[0].id).then()
    } else {
      message.error("删除菜单失败");
    }
  };

  const onSelect = (_selectedKeys: React.Key[], info: any) => {
    setMenuType(info.node.isLeaf ? 2 : 1)
    setMenuCreate({key: info.node.key, title: info.node.title})
    getMenu(info.node.key).then()
  };

  const addMenu = (
    <Button type="primary"
            onClick={() => {
              setFormType(1)
              setCreateFormVisible(true)
            }}><PlusOutlined /></Button>);

  const addFun = (
    <Button type="primary"
            onClick={() => {
              setFormType(2)
              setCreateFormVisible(true)
            }}><PlusOutlined />添加</Button>);

  function deleteModal(menu: MenuListItem) {
    confirm({
      title: '删除菜单',
      content: '确定删除菜单<' + menu.name + '>?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        handleDeleteMenu(menu.id).then()
      },
    });
  }

  const menuColumns: ColumnsType<MenuListItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 120,
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
        return menuIcons[icon as string]
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
                  onClick={() => {
                    setMenuUpdate(menu)
                    setFormType(1)
                    setUpdateFormVisible(true)
                  }}>编辑</Button>
          <Divider type="vertical" />
          <Button type="link"
                  onClick={() => deleteModal(menu)}
          >删除</Button>
        </Fragment>
      ),
    },
  ];

  const funColumns: ColumnsType<MenuListItem> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      align: 'center',
      width: 80,
    },
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      width: 120,
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
      render: (menu: MenuListItem) => (
        <Fragment>
          <Button type="link"
                  onClick={() => {
                    setMenuUpdate(menu)
                    setFormType(2)
                    setUpdateFormVisible(true)
                  }}>编辑</Button>
          <Divider type="vertical" />
          <Button type="link"
                  size={"small"}
                  onClick={() => deleteModal(menu)
                  }>删除</Button>
        </Fragment>
      ),
    },
  ];

  return (
    <div>
      <Row gutter={8}>
        <Col flex="300px">
          <Card title={treeTitle} extra={addMenu}>
            <DirectoryTree
              switcherIcon={<DownOutlined />}
              showIcon={false}
              onSelect={onSelect}
              treeData={menusTree} />
          </Card>
        </Col>
        <Col flex="auto">
          <div>
            {menuType !== 0 ?
              <Card title={menuType === 2 ? '菜单' : '目录'}>
                <Table
                  columns={menuColumns}
                  dataSource={selectedMenu}
                  rowKey={selectedMenu => selectedMenu.id}
                  loading={loading}
                  size={'middle'}
                  pagination={{
                    hideOnSinglePage: true,
                    pageSize: 10
                  }}
                />
              </Card> : null}
            {menuType === 2 ?
              <Card title={funTitle} extra={addFun} style={{marginTop: "8px"}}>
                <Table
                  columns={funColumns}
                  dataSource={selectedFuns}
                  rowKey={selectedFuns => selectedFuns.id}
                  loading={loading}
                  size={'small'}
                  pagination={{
                    hideOnSinglePage: true,
                    pageSize: 10
                  }}
                />
              </Card> : null}
          </div>
        </Col>
      </Row>
      {createFormVisible ?
        <CreateForm
          open={createFormVisible}
          formType={formType}
          menusSelect={menusSelect}
          menu={menuCreate}
          onOk={handleCreateMenu}
          onCancel={() => {
            setCreateFormVisible(false)
          }}
        /> : null}
      {updateFormVisible ?
        <UpdateForm
          open={updateFormVisible}
          formType={formType}
          menusSelect={menusSelect}
          menu={menuUpdate}
          onOk={handleUpdateMenu}
          onCancel={() => {
            setUpdateFormVisible(false)
          }}
        /> : null}
    </div>
  );
}
export default Menu;
