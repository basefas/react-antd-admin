import {post} from "../utils/request";


export async function login(user) {
  return await post('/api/v1/login', user)
}
