import * as s1 from '@/services/s1.js';
import * as api from '@/services/api';
import * as user from '@/services/user';
import * as role from '@/services/role';

export default {
  //记录需要权控制的接口，不需要控制的接口不必记录
  role_auth: {
    title: '操作角色信息',
    depend: [role.roleList, role.getRole],
  },
  analysis_charts: {
    title: '图表数据集合',
    depend: [api.fakeChartData],
  },
  monitor_tag: {
    title: '热门搜索标签',
    depend: [api.queryTags],
  },
  user_list: {
    title: '用户列表',
    depend: [user.query],
  },
  test_filter: {
    title: '过滤插件',
    depend: [s1.add, s1.edit],
  },
  test_list: {
    title: '测试列表',
    depend: [s1.list],
  },
  test_add: {
    title: '新增',
    depend: [s1.add],
  },
  test_edit: {
    title: '修改密码',
    depend: [s1.passwordEdit],
  },
};
