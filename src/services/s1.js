import { stringify } from 'qs';
import request from '@/utils/request';

export const add = {
  title: '新增',
  url: '/api/test/add',
  req: params => request(`${add.url}?${stringify(params)}`),
};
export const edit = {
  title: '编辑',
  url: '/api/test/edit',
  req: params => request(`${edit.url}?${stringify(params)}`),
};

export const list = {
  title: '测试列表',
  url: '/api/test/list',
  req: params => request(`${list.url}?${stringify(params)}`),
};
export const passwordEdit = {
  title: '修改密码',
  inborn: true, //不需权限控制
  url: '',
  req: params =>
    request(`${passwordEdit.url}`, {
      method: 'POST',
      body: params,
    }),
};
export const getMenuData = {
  title: '获取用户菜单',
  inborn: true,
  url: '/api/getMenu',
  req: params =>
    request(`${getMenuData.url}`, {
      method: 'POST',
      body: params,
    }),
};
