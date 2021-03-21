import { del, get, post, put, ResponseData } from "../../../utils/request";
import { UserCreateInfo, UserListItem, UserUpdateInfo } from "./data";

export async function userList(): Promise<ResponseData<UserListItem[]>> {
  return await get<UserListItem[]>('/api/v1/users')
}

export async function createUser(user: UserCreateInfo): Promise<ResponseData<{}>> {
  return await post<{}>('/api/v1/users', user)
}

export async function updateUser(id: number, user: UserUpdateInfo): Promise<ResponseData<{}>> {
  return await put<{}>('/api/v1/users/' + id, user)
}

export async function deleteUser(id: number): Promise<ResponseData<{}>> {
  return await del<{}>('/api/v1/users/' + id)
}
