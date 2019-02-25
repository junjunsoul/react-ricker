import * as s1 from '@/services/s1.js';

export default {
  //记录需要权控制的接口，不需要控制的接口不必记录
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
};