import axios, { AxiosRequestConfig } from 'axios'
import { deleteToken, getToken } from "./auth";
import { message, Modal } from "antd";

const {confirm} = Modal;

export interface ResponseData<T> {
  code: number;
  data: T;
  message: string;
}

const instance = axios.create({
  baseURL: (window as any).CONFIG.API_HOST + ':' + (window as any).CONFIG.API_PORT || 'http://localhost:8086',
  timeout: (window as any).CONFIG.API_TIMEOUT || 5000,
});

instance.interceptors.request.use(
  function (config: AxiosRequestConfig) {
    config.headers["token"] = getToken();
    return config;
  },
  function (error: any) {
    return Promise.reject(error);
  });

instance.interceptors.response.use(
  response => {
    if (response.data.code === -2) {
      confirm({
        title: ' Token 失效, 请重新登录!',
        onOk() {
          window.location.href = '/login'
          deleteToken()
        },
        onCancel() {
          deleteToken()
        },
      });
    }
    return Promise.resolve(response.data);
  },
  error => {
    if (error.response) {
      message.error(error.response.status + ': ' + error.response.statusText).then()
    } else {
      message.error('服务器错误: ' + error.message).then()
    }
    return Promise.reject(error);
  });

export function get<T>(url: string, params?: any): Promise<ResponseData<T>> {
  return instance.get(url, {params})
}

export function post<T>(url: string, data?: any, params?: any): Promise<ResponseData<T>> {
  return instance.post(url, data, {params})
}

export function put<T>(url: string, data?: any, params?: any): Promise<ResponseData<T>> {
  return instance.put(url, data, {params})
}

export function del<T>(url: string, params?: any): Promise<ResponseData<T>> {
  return instance.delete(url, {params})
}
