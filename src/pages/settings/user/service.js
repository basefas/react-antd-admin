import {get, post, put, del} from "../../../utils/request";

export async function userList() {
  return await get('/api/v1/users')
}

export async function createUser(user) {
  return await post('/api/v1/users', user)
}

export async function updateUser(id, user) {
  return await put('/api/v1/users/' + id, user)
}

export async function deleteUser(id) {
  return await del('/api/v1/users/' + id)
}
