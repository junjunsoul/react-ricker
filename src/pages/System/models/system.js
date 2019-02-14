import { roleList, getRole } from '@/services/role';
export default {
  namespace: 'system',
  state: {
    roleList: [],
    roleInfo: [],
  },
  effects: {
    *fetchRoleList(payload, { call, put }) {
      const response = yield call(roleList.req, payload);
      if (response && !response.code) {
        yield put({
          type: 'saveRoleList',
          payload: response,
        });
      }
    },
    *fetchRoleInfo(payload, { call, put }) {
      const response = yield call(getRole.req, payload);
      yield put({
        type: 'saveRoleInfo',
        payload: response,
      });
    },
  },
  reducers: {
    saveRoleList(state, { payload }) {
      return {
        ...state,
        roleList: payload.data,
      };
    },
    saveRoleInfo(state, { payload }) {
      return {
        ...state,
        roleInfo: payload.data,
      };
    },
  },
};
