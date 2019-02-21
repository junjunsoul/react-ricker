import { roleList, getRole } from '@/services/role';
export default {
  namespace: 'system',
  state: {},
  effects: {
    *fetchRoleList({ payload, callback }, { call, put }) {
      const response = yield call(roleList.req, payload);
      callback(response);
    },
    *fetchRoleInfo({ payload, callback }, { call, put }) {
      const response = yield call(getRole.req, payload);
      callback(response);
    },
  },
  reducers: {},
};
