import { FC, useEffect, useState } from 'react';
import { Checkbox, Modal, Table } from 'antd';
import { MenuListItem } from "../../menu/data";
import { RoleListItem } from "../data";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import { roleMenus } from "../service";

interface PermissionFormProps {
  open: boolean;
  role: RoleListItem;
  menus: MenuListItem[];
  onOk: (id: number, checkedList: number[]) => void;
  onCancel: () => void;
}

const PermissionForm: FC<PermissionFormProps> = (props) => {
  const {open, role, menus, onOk, onCancel} = props

  const [menusTree, setMenusTree] = useState<any>()
  const [loading, setLoading] = useState(false)
  const [firstIn, setFirstIn] = useState(true)
  const [checkedList, setCheckedList] = useState<number[]>([]);
  const [indeterminateList, setIndeterminateList] = useState<number[]>([]);
  const [fMap, setFMap] = useState<Map<number, Array<number>>>(new Map())
  const [sMap, setSMap] = useState<Map<number, Array<number>>>(new Map())
  let fatherMap = new Map();
  let sonMap = new Map();

  const getRoleMenus = async (id: number) => {
    const result = await roleMenus(id);
    setLoading(false);
    if (result.code === 0) {
      setCheckedList(result.data)
    }
  };

  useEffect(() => {
    setMenusTree(makeMenus(menus))
    makeList([], menus)
    setFMap(fatherMap)
    setSMap(sonMap)
    // eslint-disable-next-line
  }, [menus])

  useEffect(() => {
    setLoading(true)
    getRoleMenus(role.id).then()
  }, [role])

  useEffect(() => {
    updateIndeterminate()
    // eslint-disable-next-line
  }, [checkedList]);


  const ok = () => {
    onOk(role.id, checkedList);
  }

  const onChangeCheckbox = (e: CheckboxChangeEvent) => {
    updateChecked(e.target.value.id, e.target.checked, e.target.value.parent_id)
  };

  const makeMenus = (menus: MenuListItem[]): any => {
    return menus.map(({children, ...item}) => ({
      ...item,
      children: children.length === 0 ? null : makeMenus(children),
    }));
  }

  const makeList = (fids: number[], menus: MenuListItem[]) => {
    for (const menu of menus) { //遍历所有 menu
      if (menu.children.length !== 0) { //如果有 children
        const cg: number[] = []
        for (const child of menu.children) {
          cg.push(child.id)  //把 children ID 添加进集合
        }
        fatherMap.set(menu.id, cg) // menu 的 ID 和 children ID 的集合
        makeList([menu.id].concat(fids), menu.children) // 把当前层有 children 的 menu ID 传给下一层
      }
      if (menu.parent_id !== 0) {
        sonMap.set(menu.id, fids) //非根目录时，记录当前 menu ID 的父节点集合
      }
      if (menu.funs.length !== 0) { //如果有 funs
        const cg: number[] = []
        for (const fun of menu.funs) {
          cg.push(fun.id)  //把 fun ID 添加进集合
          sonMap.set(fun.id, [menu.id].concat(fids)) //记录当前 fun ID 的父节点集合
        }
        fatherMap.set(menu.id, cg) // menu 的 ID 和 fun ID 的集合
      }

    }
  }

  const updateChecked = (id: number, checked: boolean, fid: number) => {
    if (!checked) {
      checked = !checked && indeterminateList.includes(id);
    }
    let gcl = new Set<number>(checkedList);
    let gil = new Set<number>(indeterminateList);
    checked ? gcl.add(id) : gcl.delete(id)
    gil.delete(id)
    if (fMap.has(id)) {
      updateChildren(gcl, gil, id, checked)
    }
    if (fid !== 0) {
      updateFather(gcl, gil, id, checked)
    }
    setCheckedList(Array.from(gcl))
    setIndeterminateList(Array.from(gil))
  }

  const updateChildren = (gcl: Set<number>, gil: Set<number>, id: number, checked: boolean) => {
    if (fMap.has(id)) {
      // todo remove ignore
      // @ts-ignore
      for (let child of fMap.get(id)) {
        checked ? gcl.add(child) : gcl.delete(child)
        gil.delete(child)
        updateChildren(gcl, gil, child, checked)
      }
    }

  }

  const updateFather = (gcl: Set<number>, gil: Set<number>, id: number, checked: boolean) => {
    if (sMap.has(id)) {
      // todo remove ignore
      // @ts-ignore
      for (let fid of sMap.get(id)) { //遍历点击节点的所有父节点，按层级倒序排列
        const fcl = intersection(new Set(fMap.get(fid)), gcl) //此父节点的子节点选中的集合
        const fil = intersection(new Set(fMap.get(fid)), gil) //此父节点的子节点半选的集合

        if (checked) {
          gcl.add(fid) //设置此父节点为选中状态
          // todo remove ignore
          // @ts-ignore
          if (fcl.size === fMap.get(fid).length && fil.size === 0) { //此父节点选中的集合大小等于总集合大小时，且此父节点的子节点没有半选时取消半选状态
            gil.delete(fid)
          }
        } else {
          gil.add(fid) //设置此父节点为半选状态
          if (fcl.size === 0) { //此父节点选中的集合大小等于0时，设置父节点为取消状态，取消半选状态
            gcl.delete(fid)
            gil.delete(fid)
          }
        }
      }
    }
  }

  const updateIndeterminate = () => {
    const i: number[] = []
    for (let [id, sonIds] of Array.from(fMap)) { //遍历所有有子节点的集合
      const ccl = intersection(new Set(sonIds), new Set(checkedList)) //此节点的子节点选中的集合
      if (firstIn) { //首次进入时半选集合为空
        if (sonIds.length !== ccl.size && ccl.size > 0) { //此节点子节点选中的集合大小不等于此节点子节点总集合大小时，且有选中的子节点
          i.push(id)
          setFirstIn(false)
        }
      } else { //非首次进入时需要校验半选集合
        const cil = intersection(new Set(sonIds), new Set(indeterminateList)) //此节点的子节点半选的集合
        if ((sonIds.length === ccl.size && cil.size > 0) || (sonIds.length !== ccl.size && ccl.size > 0)) {
          //此节点子节点选中的集合大小等于此节点子节点总集合大小时，且有半选的子节点 OR
          //此节点子节点选中的集合大小不等于此节点子节点总集合大小时，且有选中的子节点
          i.push(id)
        }
      }
    }
    setIndeterminateList(i)
  }

  function intersection(setA: Set<number>, setB: Set<number>) {
    let _intersection = new Set();
    for (let elem of Array.from(setB)) {
      if (setA.has(elem)) {
        _intersection.add(elem);
      }
    }
    return _intersection;
  }

  const columns: any = [
    {
      title: '菜单',
      dataIndex: 'id',
      align: 'left',
      width: 200,
      render: (_text: any, record: MenuListItem) => {
        return (<Checkbox
          id={record.id as any}
          value={record}
          checked={checkedList.includes(record.id)}
          indeterminate={indeterminateList.includes(record.id)}
          onChange={onChangeCheckbox}
        >
          {record.name}
        </Checkbox>)
      }
    },
    {
      title: '功能',
      dataIndex: 'id',
      align: 'left',
      render: (_text: any, record: MenuListItem) => {
        return (
          <div>{
            record.funs.map(value => {
              return <Checkbox
                style={{margin: "0 4px"}}
                id={value.id as any}
                value={value}
                checked={checkedList.includes(value.id)}
                onChange={onChangeCheckbox}>
                {value.name}
              </Checkbox>
            })}
          </div>
        )
      }
    },
  ];

  return (
    <Modal
      title="权限设置"
      open={open}
      onOk={ok}
      onCancel={onCancel}
      destroyOnClose={true}
      width={720}>
      <Table
        columns={columns}
        dataSource={menusTree}
        rowKey={data => data.id}
        pagination={false}
        loading={loading}
        size={'small'}
        bordered
        scroll={{y: 360}}
      />
    </Modal>
  )
}
export default PermissionForm;
