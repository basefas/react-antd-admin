export interface MenuListItem {
  id: number;
  name: string;
  path: string;
  type: number;
  method: string;
  icon: string;
  parent_id: number;
  order_id: number;
  children: MenuListItem[];
  funs: MenuListItem[];
}

export interface MenuCreateInfo {
  name: string;
  path: string;
  type: number;
  method: string;
  icon: string;
  parent_id: number;
  order_id: number;
}

export interface MenuUpdateInfo {
  name?: string;
  path?: string;
  type?: number;
  method?: string;
  icon?: string;
  parent_id?: number;
  order_id?: number;
}
