import { get, ResponseData } from "../utils/request";
import { MenuDataItem } from "@ant-design/pro-layout";

export async function systemMenuList(): Promise<ResponseData<MenuDataItem[]>> {
  return await get<MenuDataItem[]>('/api/v1/menus', {type: "system"})
}
