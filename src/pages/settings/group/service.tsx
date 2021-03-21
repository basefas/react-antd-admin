import { del, get, post, put, ResponseData } from "../../../utils/request";
import { GroupCreateInfo, GroupListItem, GroupUpdateInfo } from "./data";

export async function groupList(): Promise<ResponseData<GroupListItem[]>> {
  return await get<GroupListItem[]>('/api/v1/groups')
}

export async function createGroup(group: GroupCreateInfo): Promise<ResponseData<{}>> {
  return await post<{}>('/api/v1/groups', group)
}

export async function updateGroup(id: number, group: GroupUpdateInfo): Promise<ResponseData<{}>> {
  return await put<{}>('/api/v1/groups/' + id, group)
}

export async function deleteGroup(id: number): Promise<ResponseData<{}>> {
  return await del<{}>('/api/v1/groups/' + id)
}
