import { del, get, post, put, ResponseData } from "../../../utils/request";
import { RoleCreateInfo, RoleListItem, RoleUpdateInfo } from "./data";

export async function roleList(): Promise<ResponseData<RoleListItem[]>> {
  return await get<RoleListItem[]>('/api/v1/roles')
}

export async function createRole(role: RoleCreateInfo): Promise<ResponseData<{}>> {
  return await post<{}>('/api/v1/roles', role)
}

export async function updateRole(id: number, role: RoleUpdateInfo): Promise<ResponseData<{}>> {
  return await put<{}>('/api/v1/roles/' + id, role)
}

export async function deleteRole(id: number): Promise<ResponseData<{}>> {
  return await del<{}>('/api/v1/roles/' + id)
}

export async function roleMenus(id: number): Promise<ResponseData<number[]>> {
  return await get<number[]>('/api/v1/roles/' + id + '/menus')
}

export async function updateRoleMenus(id: number, menus: number[]): Promise<ResponseData<{}>> {
  return await put<{}>('/api/v1/roles/' + id + '/menus', menus)
}
