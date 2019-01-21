import request from '@/utils/request';
//注：inborn 属性表示公共接口无需权限控制
export const query = {
  title: '用户列表',
  url: '/api/users',
  req: async () => {
    return request('/api/users');
  },
};
export const queryCurrent = {
  title: '用户信息',
  url: '/api/currentUser',
  inborn: true,
  req: async () => {
    return request('/api/currentUser');
  },
};
