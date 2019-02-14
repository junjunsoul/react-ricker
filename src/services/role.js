import { stringify } from 'qs';
import request from '@/utils/request';

export const roleList = {
  title: '角色列表',
  url: '/api/roleList',
  req: async params =>
    request(`${roleList.url}`, {
      method: 'POST',
      body: params,
    }),
};

export const getRole = {
  title: '角色详情',
  url: '/api/getRole',
  req: async params =>
    request(`${getRole.url}`, {
      method: 'POST',
      body: params,
    }),
};
