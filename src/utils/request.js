import axios from 'axios'
import {getToken} from "./auth";
import {message} from "antd";

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
    return Promise.resolve(response.data);
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
