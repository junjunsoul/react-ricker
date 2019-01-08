import { query as queryUsers, queryCurrent } from '@/services/user';
import { getMenuData } from '@/services/s1';
import { getAuthMenus } from '@/authorize/utils';
export default {
  namespace: 'user',

  state: {
    list: [],
    currentUser: {},
    port: [],
    authMenus: [],
    isLoad: true,
  },

  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers.req);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent.req);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
    *fetchMenuData({ payload }, { call, put }) {
      const response = yield call(getMenuData.req);
      if (!response.code) {
        yield put({
          type: 'saveMenuData',
          payload: {
            port: response.data,
            authMenus: getAuthMenus(payload.routes, response.data),
          },
        });
      }
    },
  },

  reducers: {
    save(state, action) {
      return {
        ...state,
        list: action.payload,
      };
    },
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload || {},
      };
    },
    changeNotifyCount(state, action) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
    saveMenuData(state, action) {
      const { port, authMenus } = action.payload;
      return {
        ...state,
        isLoad: false,
        port: port || [],
        authMenus: authMenus || [],
      };
    },
  },
};
