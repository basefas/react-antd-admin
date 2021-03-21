import { post, ResponseData } from "../../utils/request";
import { UserLogInInfo, UserLogIn } from "./data";

export async function login(user: UserLogIn): Promise<ResponseData<UserLogInInfo>> {
  return await post('/api/v1/login', user)
}
