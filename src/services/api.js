import { stringify } from 'qs';
import request from '@/utils/request';

export const queryProjectNotice = {
  title: '进行中的项目',
  url: '/api/project/notice',
  req: async () => {
    return request('/api/project/notice');
  },
};

export const queryActivities = {
  title: '活动消息',
  url: '/api/activities',
  req: async () => {
    return request('/api/activities');
  },
};

export const queryRule = {
  title: '查询规则配置',
  url: '/api/rule',
  req: async params => {
    return request(`/api/rule?${stringify(params)}`);
  },
};

export const removeRule = {
  title: '删除规则配置',
  url: '/api/rule',
  req: async params => {
    return request('/api/rule', {
      method: 'POST',
      body: {
        ...params,
        method: 'delete',
      },
    });
  },
};

export const addRule = {
  title: '新增规则配置',
  url: '/api/rule',
  req: async params => {
    return request('/api/rule', {
      method: 'POST',
      body: {
        ...params,
        method: 'post',
      },
    });
  },
};

export const updateRule = {
  title: '更新规则配置',
  url: '/api/rule',
  req: async params => {
    return request('/api/rule', {
      method: 'POST',
      body: {
        ...params,
        method: 'update',
      },
    });
  },
};

export const fakeSubmitForm = {
  title: '基础表单提交',
  url: '/api/forms',
  req: async params => {
    return request('/api/forms', {
      method: 'POST',
      body: params,
    });
  },
};

export const fakeChartData = {
  title: '拉取报表数据',
  url: '/api/fake_chart_data',
  req: async () => {
    return request('/api/fake_chart_data');
  },
};

export const queryTags = {
  title: '热门搜索标签',
  url: '/api/tags',
  req: async () => {
    return request('/api/tags');
  },
};

export const queryBasicProfile = {
  title: '',
  url: '/api/profile/basic',
  req: async () => {
    return request('/api/profile/basic');
  },
};

export const queryAdvancedProfile = {
  title: '',
  url: '/api/profile/advanced',
  req: async () => {
    return request('/api/profile/advanced');
  },
};

export const queryFakeList = {
  title: '任务列表',
  url: '/api/fake_list',
  req: async params => {
    return request(`/api/fake_list?${stringify(params)}`);
  },
};

export const removeFakeList = {
  title: '删除任务',
  url: '/api/fake_list',
  req: async params => {
    const { count = 5, ...restParams } = params;
    return request(`/api/fake_list?count=${count}`, {
      method: 'POST',
      body: {
        ...restParams,
        method: 'delete',
      },
    });
  },
};
export const addFakeList = {
  title: '新增任务',
  url: '/api/fake_list',
  req: async params => {
    const { count = 5, ...restParams } = params;
    return request(`/api/fake_list?count=${count}`, {
      method: 'POST',
      body: {
        ...restParams,
        method: 'post',
      },
    });
  },
};

export const updateFakeList = {
  title: '修改任务',
  url: '/api/fake_list',
  req: async params => {
    const { count = 5, ...restParams } = params;
    return request(`/api/fake_list?count=${count}`, {
      method: 'POST',
      body: {
        ...restParams,
        method: 'update',
      },
    });
  },
};

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/notices');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
