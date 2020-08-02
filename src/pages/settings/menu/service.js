import {get, post, put, del} from "../../../utils/request";

export async function menuList() {
  return await get('/api/v1/menus?type=tree')
}

export async function createMenu(menu) {
  return await post('/api/v1/menus', menu)
}

export async function updateMenu(menuID, menu) {
  return await put('/api/v1/menus/' + menuID, menu)
}

export async function deleteMenu(menuID) {
  return await del('/api/v1/menus/' + menuID + '?type=tree')
}

export async function menuGet(menuID) {
  return await get('/api/v1/menus/' + menuID + '?type=tree')
}
