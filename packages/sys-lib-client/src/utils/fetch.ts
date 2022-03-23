import axios from 'axios';

const baseURL = '/api';

const isObject = (data: any) =>
  Object.prototype.toString.call(data) === '[object Object]';

// 根据不同的状态码，生成不同的提示信息
const showStatus = (status: number) => {
  let message = '';
  // 这一坨代码可以使用策略模式进行优化
  switch (status) {
    case 400:
      message = '请求错误(400)';
      break;
    case 401:
      message = '未授权，请重新登录(401)';
      break;
    case 403:
      message = '拒绝访问(403)';
      break;
    case 404:
      message = '请求出错(404)';
      break;
    case 408:
      message = '请求超时(408)';
      break;
    case 500:
      message = '服务器错误(500)';
      break;
    case 501:
      message = '服务未实现(501)';
      break;
    case 502:
      message = '网络错误(502)';
      break;
    case 503:
      message = '服务不可用(503)';
      break;
    case 504:
      message = '网络超时(504)';
      break;
    case 505:
      message = 'HTTP版本不受支持(505)';
      break;
    default:
      message = `连接出错(${status})!`;
  }
  return `${message}，请检查网络或联系管理员！`;
};

const fetch = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  timeout: 600000,
  // 在向服务器发送请求前，序列化请求数据
  transformRequest: [
    (data) => {
      data = JSON.stringify(data);
      return data;
    },
  ],
  // 在传递给 then/catch 前，修改响应数据
  transformResponse: [
    (data) => {
      if (typeof data === 'string' && data.startsWith('{')) {
        data = JSON.parse(data);
      }
      return data;
    },
  ],
});

// 响应拦截器
fetch.interceptors.response.use(
  (response) => {
    const { status, data } = response;
    let message = '';
    if (status < 200 || status >= 300) {
      // 处理 http 错误，抛到业务代码
      message = showStatus(status);
      if (typeof data === 'string') {
        response.data = { message };
      } else {
        response.data.message = message;
      }
    }
    return response.data;
  },
  (error) => {
    const message = '请求超时或服务器异常，请检查网络或联系管理员！';
    // 错误抛到业务代码
    error.data = {};
    error.data.message = message;
    return Promise.reject(error);
  },
);

export default fetch;
