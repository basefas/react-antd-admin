import {get} from "../../utils/request";

export async function menuList() {
  return await get('/api/v1/menus?type=system')
}
