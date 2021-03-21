import { del, get, post, put, ResponseData } from "../../../utils/request";
import { MenuCreateInfo, MenuListItem, MenuUpdateInfo } from "./data";

export async function menuList(): Promise<ResponseData<MenuListItem[]>> {
  return await get<MenuListItem[]>('/api/v1/menus?type=tree')
}

export async function createMenu(menu: MenuCreateInfo): Promise<ResponseData<{}>> {
  return await post<{}>('/api/v1/menus', menu)
}

export async function updateMenu(id: number, menu: MenuUpdateInfo): Promise<ResponseData<{}>> {
  return await put<{}>('/api/v1/menus/' + id, menu)
}

export async function deleteMenu(id: number): Promise<ResponseData<{}>> {
  return await del<{}>('/api/v1/menus/' + id + '?type=tree')
}

export async function menuGet(id: number): Promise<ResponseData<MenuListItem>> {
  return await get<MenuListItem>('/api/v1/menus/' + id + '?type=tree')
}
