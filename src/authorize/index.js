import system from './chip/system';
import { isEmpty } from 'lodash';

export const authChip = {
  system: {
    title: '系统管理',
    chip: system,
  },
};
//根据名称获取权限对象
export const getChip = chipName => {
  let names = chipName.split('.');
  let a1 = authChip[names[0]];
  if (a1) {
    return a1.chip[names[1]];
  }
  return null;
};
//处理权限碎片是否可用
export const handleChip = (chipName, authority) => {
  let chip = Object.assign({}, getChip(chipName));
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
    return chip;
  }
  throw new Error(`未找到对应的权限-${chipName}`);
};
//把权限碎片挂载到路由属性上
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
