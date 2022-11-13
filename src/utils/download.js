import axios from 'axios';
const service = axios.create({
  responseType: 'arraybuffer',
});

service.interceptors.request.use(
  (config) => {
    config.headers['Authorization'] = window.sessionStorage.getItem('tokenStr');
    return config;
  },
  (error) => console.error(error),
);

service.interceptors.response.use(
  (resp) => {
    const headers = resp.headers;
    let reg = new RegExp(/application\/json/);

    if (headers['content-type'].match(reg)) {
      resp.data = unitToString(resp.data);
    } else {
      let fileDownload = require('js-file-download'); // 插件
      let fileName = headers['content-disposition']
        .split(';')[1]
        .split('filename=')[1]; //文件名
      let contentType = headers['content-type']; // 响应类型
      fileName = decodeURIComponent(fileName); // 格式转换 防止乱码
      fileDownload(resp.data, fileName, contentType); // 通过插件下载文件
    }
  },
  (error) => {
    console.log(error);
  },
);

function unitToString(unitArray) {
  let encodedString = String.fromCharCode.apply(
    null,
    new Uint8Array(unitArray),
  );
  let decodedString = decodeURIComponent(escape(encodedString));
  return JSON.parse(decodedString);
}

// 下载文件的请求
let base = '';
export const downloadRequest = (url, params) => {
  return service({
    method: 'get',
    url: `${base}${url}`,
    data: params,
  });
};

// 整体暴露出去，供外界调用
export default service;
