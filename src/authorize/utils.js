import memoizeOne from 'memoize-one';
import { isEqual } from 'lodash';
import { handleChip } from './authChip';

// Conversion router to menu.
function formatter(data) {
  return data
    .map(item => {
      if (!item.redirect) {
        if (!item.name || !item.path) {
          return null;
        }
      }

      const result = {
        ...item,
      };
      if (item.routes) {
        const children = formatter(item.routes);
        // Reduce memory usage
        result.children = children;
      }
      delete result.routes;
      return result;
    })
    .filter(item => item);
}
//检查权限
function check(authority, item) {
  item.available = true;
  if (item.authChip) {
    let authChip = {};

    item.authChip.forEach(chipName => {
      authChip[chipName] = handleChip(chipName, authority);
    });
    item.authChip = authChip;

    //检查最小可见权限
    if (item.miniDepend) {
      item.miniDepend.forEach(chipName => {
        if (authChip[chipName]) {
          if (!authChip[chipName].available) item.available = false;
        } else {
          throw new Error(`${item.name}-最小可见权限配置错误-${chipName}`);
        }
      });
    }
  }
  if (!item.children) {
    checkParent(item, item.available);
  }
}
function checkParent(item, available) {
  if (item.parent && !item.parent.available) {
    item.parent.available = available;
    checkParent(item.parent, available);
  }
}
const memoizeOneFormatter = memoizeOne(formatter, isEqual);

/**
 * get SubMenu or Item
 */
const getSubMenu = (item, authority, parent) => {
  item.parent = parent;
  if (item.children) {
    item.available = false;
    return {
      ...item,
      children: filterMenuData(item.children, authority, item), // eslint-disable-line
    };
  }
  check(authority, item);
  return item;
};

/**
 * filter menuData
 */
const filterMenuData = (menuData, authority, parent = null) => {
  if (!menuData) {
    return [];
  }
  return menuData.map(item => getSubMenu(item, authority, parent));
};

export function getAuthMenus(routes, authority) {
  return filterMenuData(memoizeOneFormatter(routes), authority);
}
