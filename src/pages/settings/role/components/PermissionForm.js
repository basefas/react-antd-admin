import React, {Component} from 'react';
import {Checkbox, Modal, Table} from 'antd';
import {roleMenus} from "../service";

class PermissionForm extends Component {

  state = {
    checkedList: new Set(),
    menusList: {},
    menusTree: [],
    indeterminate: new Set(),
  };

  constructor(props) {
    super(props);
    this.init();
    this.menusList = {};
    this.indeterminate = new Set();
    this.checked = new Set();
  }

  componentDidMount() {
    const menusTree = this.makelist(this.props.menus)
    this.setState(
      {
        menusTree: menusTree,
        menusList: this.menusList,
      }
    )
    this.getRoleMenus(this.props.role.id)
  }

  okHandle = () => {
    const checkedList = this.state.checkedList
    checkedList.delete(0)
    this.props.handleUpdatePermission(this.props.role.id, Array.from(checkedList))
  };

  cancelHandle = () => {
    this.props.handlePermissionModalVisible(false)
  };

  onChangeCheckbox = (e) => {
    this.checked = this.state.checkedList
    this.indeterminate = this.state.indeterminate
    this.updateChecked(e.target.id, e.target.checked)
  };

  initChecked = (ids) => {
    const pages = []
    const menus = []
    for (const id of ids) {
      if (this.state.menusList[id].menu_type === 1) {
        menus.push(id)
      } else if (this.state.menusList[id].menu_type === 2) {
        pages.push(id)
      } else if (this.state.menusList[id].menu_type === 3) {
        this.checked.add(id)
      }
    }

    for (const id of pages) {
      if (this.state.menusList[id].funs.length !== 0) {
        const children = Object.values(this.state.menusList).filter(v => v.parent_id === id).map((i) => {
          return i.id
        })
        const checked = this.intersection(children, new Set(ids))
        if (checked.size === children.length) {
          this.checked.add(id)
        } else {
          this.checked.add(id)
          this.indeterminate.add(id)
        }
      } else {
        this.checked.add(id)
      }
    }

    for (const id of menus) {
      if (this.state.menusList[id].children.length !== 0) {
        const children = Object.values(this.state.menusList).filter(v => v.parent_id === id).map((i) => {
          return i.id
        })
        const checked = this.intersection(children, new Set(ids))
        const indeterminate = this.intersection(children, this.indeterminate)
        if (checked.size === children.length && indeterminate.size === 0) {
          this.checked.add(id)
        } else {
          this.checked.add(id)
          this.indeterminate.add(id)
        }
      } else {
        this.checked.add(id)
      }
    }

    this.setState({
      checkedList: this.checked,
      indeterminate: this.indeterminate
    })
  }

  updateChecked = (id, checked) => {
    if (this.indeterminate.has(id)) {
      checked = true
    } else {
      if (checked) {
        this.checked.add(id)
      } else {
        this.checked.delete(id)
      }
    }
    this.indeterminate.delete(id)
    this.updateParent(id)
    this.updateChildren(id, checked)
    this.setState({
      checkedList: this.checked,
      indeterminate: this.indeterminate
    })
  }

  updateParent = (id) => {
    const pid = this.getPid(id)
    const group = Object.values(this.state.menusList).filter(v => v.parent_id === pid).map((i) => {
      return i.id
    })
    const checked = this.intersection(group, this.checked)
    const indeterminate = this.intersection(group, this.indeterminate)
    if (checked.size === group.length && indeterminate.size === 0) {
      this.checked.add(pid)
      this.indeterminate.delete(pid)
    } else if (checked.size === 0) {
      this.checked.delete(pid)
      this.indeterminate.delete(pid)
    } else {
      this.checked.add(pid)
      this.indeterminate.add(pid)
    }
    if (pid !== 0) {
      this.updateParent(pid)
    }
  }

  updateChildren = (id, checked) => {
    const children = this.getChildren(id)
    const funs = this.getFuns(id)

    if (children.length !== 0) {
      for (const child of children) {
        if (checked) {
          this.checked.add(child.id)
        } else {
          this.checked.delete(child.id)
        }
        this.indeterminate.delete(child.id)
        this.updateChildren(child.id, checked)
      }
    }
    if (funs.length !== 0) {
      for (const fun of funs) {
        if (checked) {
          this.checked.add(fun.id)
        } else {
          this.checked.delete(fun.id)
        }
        this.indeterminate.delete(fun.id)
        this.updateChildren(fun.id)
      }
    }
  }

  getPid = (id) => {
    return this.state.menusList[id].parent_id
  }

  getChildren = (id) => {
    return this.state.menusList[id].children
  }

  getFuns = (id) => {
    return this.state.menusList[id].funs
  }

  intersection = (a, b) => {
    return new Set([...a].filter(x => b.has(x)));
  }

  init = () => {
    this.columns = [
      {
        title: '菜单',
        dataIndex: 'id',
        align: 'left',
        width: 200,
        render: (text, record) => {
          return <Checkbox
            key={record.id}
            id={record.id}
            parent_id={record.parent_id}
            menu_type={record.menu_type}
            checked={this.state.checkedList.has(record.id)}
            indeterminate={this.state.indeterminate.has(record.id)}
            onChange={this.onChangeCheckbox}
          >
            {record.name}
          </Checkbox>
        }
      },
      {
        title: '功能',
        dataIndex: 'id',
        align: 'left',
        render: (text, record) => {
          return (
            <div>{
              record.funs.map(value => {
                return <Checkbox
                  style={{margin: "0 4px"}}
                  key={value.id}
                  id={value.id}
                  parent_id={value.parent_id}
                  menu_type={value.menu_type}
                  checked={this.state.checkedList.has(value.id)}
                  onChange={this.onChangeCheckbox}
                >
                  {value.name}
                </Checkbox>
              })
            }
            </div>
          )
        }
      },
    ];
  };

  getRoleMenus = async (id) => {
    const res = await roleMenus(id);
    if (res.code === 0) {
      this.init(res.data)
      this.initChecked(res.data)
    }
  };

  makelist = (menus) => {
    const formatMenus = [];
    for (const menu of menus) {
      const formatFuns = []
      if (menu.funs.length !== 0) {
        for (const fun of menu.funs) {
          formatFuns.push({
            id: fun.id,
            name: fun.name,
            parent_id: fun.parent_id,
            menu_type: fun.menu_type,
          })
          this.menusList[fun.id] = fun
        }
      }
      formatMenus.push({
        id: menu.id,
        name: menu.name,
        parent_id: menu.parent_id,
        menu_type: menu.menu_type,
        children: menu.children.length === 0 ? null : this.makelist(menu.children),
        funs: formatFuns || []
      })
      this.menusList[menu.id] = menu
    }
    return formatMenus
  }

  render() {
    const {permissionModalVisible} = this.props;
    const {menusTree} = this.state;

    return (
      <Modal
        title="权限设置"
        visible={permissionModalVisible}
        onOk={this.okHandle}
        onCancel={this.cancelHandle}
        destroyOnClose={true}
        width={720}
      >
        <Table
          columns={this.columns}
          dataSource={menusTree}
          rowKey={data => data.id}
          onRow={this.onRow}
          pagination={false}
          size={'small'}
          bordered
          scroll={{y: 360}}
        />
      </Modal>
    )
  }
}

export default PermissionForm;
