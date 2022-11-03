import axios from 'axios';
import { Message } from 'element-ui';
import router from '@/router';

// 请求拦截器 对请求添加 Authorization
axios.interceptors.request.use(
  (config) => {
    if (window.sessionStorage.getItem('tokenStr')) {
      config.headers['Authorization'] =
        window.sessionStorage.getItem('tokenStr');
    }
    return config;
  },
  (error) => {
    console.log(error);
  },
);

// 响应拦截器
axios.interceptors.response.use(
  (success) => {
    if (success.status && success.status == 200) {
      if (
        success.data.code === 500 ||
        success.data.code === 401 ||
        success.data.code === 403
      ) {
        Message.error({ message: success.data.message });
        return;
      }
      if (success.data.message) {
        // 输出后端 添加成功 之类的信息
        Message.success({ message: success.data.message });
      }
    }
    return success.data;
  },
  (error) => {
    if (error.response.code == 504 || error.response.code == 404) {
      Message.error({ message: '服务器被吃了' });
    } else if (error.response.code == 403) {
      Message.error({ message: '权限不足' });
    } else if (error.response.code == 401) {
      Message.error({ message: '尚未登陆,请登录' });
      router.replace('/');
    } else {
      if (error.response.data.message) {
        Message.error({ message: error.response.data.message });
      } else {
        Message.error({ message: '未知错误' });
      }
    }
  },
);

let base = '';

// 传送 json 格式的 post 请求
export const postRequest = (url, params) => {
  return axios({
    method: 'post',
    url: `${base}${url}`,
    data: params,
  });
};

// 传送 json 格式的 get 请求
export const getRequest = (url, params) => {
  return axios({
    method: 'get',
    url: `${base}${url}`,
    data: params,
  });
};

// 传送 json 格式的 put 请求
export const putRequest = (url, params) => {
  return axios({
    method: 'put',
    url: `${base}${url}`,
    data: params,
  });
};

// 传送 json 格式的 delete 请求
export const deleteRequest = (url, params) => {
  return axios({
    method: 'delete',
    url: `${base}${url}`,
    data: params,
  });
};
