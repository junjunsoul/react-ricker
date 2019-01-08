import * as s1 from '@/services/s1.js';
import * as api from '@/services/api';
import * as user from '@/services/user';
import { isEmpty } from 'lodash';
const authChip = {
  //记录需要权控制的接口，不需要控制的接口不必记录

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
export default authChip;

export const handleChip = (chipName, authority) => {
  if (chipName) {
    let chip = Object.assign({}, authChip[chipName]);
    if (!isEmpty(chip)) {
      chip.available = true;
      chip.depend.forEach(item => {
        item.available = authority.indexOf(item.url) > -1;
        if (!item.inborn && !item.available) {
          chip.available = false;
        } else if (item.inborn) {
          chip.available = true;
        }
      });
    } else {
      throw new Error(`权限碎片配置错误-${chipName}`);
    }
    return chip;
  } else {
    return null;
  }
};

export function handleChipforRoute(route, authority) {
  let chipArr = route.authChip;
  let auth = {};
  if (chipArr) {
    chipArr.forEach(item => {
      auth[item] = handleChip(item, authority);
    });
  }
  route.authorized = auth;
}
