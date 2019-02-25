import * as api from '@/services/api';

export default {
  //记录需要权控制的接口，不需要控制的接口不必记录
  analysis_charts: {
    title: '图表数据集合',
    depend: [api.fakeChartData],
  },
  monitor_tag: {
    title: '热门搜索标签',
    depend: [api.queryTags],
  }
};
