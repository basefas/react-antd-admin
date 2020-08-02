import {get, post, put, del} from "../../../utils/request";

export async function roleList() {
  return await get('/api/v1/roles')
}

export async function createRole(role) {
  return await post('/api/v1/roles', role)
}

export async function updateRole(id, role) {
  return await put('/api/v1/roles/' + id, role)
}

export async function deleteRole(id) {
  return await del('/api/v1/roles/' + id)
}

export async function roleMenus(id) {
  return await get('/api/v1/roles/' + id + '/menus')
}

export async function updateRoleMenus(id, menus) {
  return await put('/api/v1/roles/' + id + '/menus', menus)
}
