import axios from 'axios'
import {deleteToken, getToken} from "./auth";
import {message, Modal} from "antd";

const { confirm } = Modal;

const instance = axios.create({
  baseURL: 'http://127.0.0.1:8086',
  timeout: 5000
});

instance.interceptors.request.use(
  function (config) {
    config.headers["token"] = getToken();
    return config;
  },
  function (error) {
    return Promise.reject(error);
  });

instance.interceptors.response.use(
  response => {
    if (response.data.code === -2) {
      confirm({
        title: ' Token 失效, 请重新登录!',
        onOk() {
          window.location.href = '/login'
          deleteToken();
        },
        onCancel() {
          deleteToken();
        },
      });
      return Promise.resolve(response.data);
    } else {
      return Promise.resolve(response.data);
    }
  },
  error => {
    if (error.response) {
      message.error(error.response.status + ': ' + error.response.statusText);
    } else {
      message.error('服务器错误: ' + error.message);
    }
    return Promise.reject(error);
  });

export function get(url, params) {
  return instance.get(url, params)
}

export function post(url, data) {
  return instance.post(url, data)
}

export function put(url, data) {
  return instance.put(url, data)
}

export function del(url) {
  return instance.delete(url)
}
