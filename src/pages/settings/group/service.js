import {get, post, put, del} from "../../../utils/request";

export async function groupList() {
  return await get('/api/v1/groups')
}

export async function createGroup(group) {
  return await post('/api/v1/groups', group)
}

export async function updateGroup(groupID, group) {
  return await put('/api/v1/groups/' + groupID, group)
}

export async function deleteGroup(groupID) {
  return await del('/api/v1/groups/' + groupID)
}
