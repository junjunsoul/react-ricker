import React, { PureComponent } from 'react';
import classNames from 'classnames/bind';
import { chunk, isEmpty, max, isEqual } from 'lodash';
import Link from 'umi/link';
import memoizeOne from 'memoize-one';
import { urlToList } from '../_utils/pathTools';
import styles from './index.less';

export default class TopMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.getSelectedMenuKeys = memoizeOne(this.getSelectedMenuKeys, isEqual);
    this.state = {
      selectedKey: [],
    };
  }

  componentDidMount() {
    const {
      location: { pathname },
    } = this.props;

    let selectedKey = this.getSelectedMenuKeys(pathname);
    this.setState({ selectedKey });
  }
  /**
   * 获得菜单子节点
   * @memberof SiderMenu
   */
  getNavMenuItems = (menusData, level = 1) => {
    if (!menusData) {
      return [];
    }
    return menusData
      .filter(item => item.name && !item.hideInMenu)
      .map(item => this.getSubMenuOrItem(item, level))
      .filter(item => item);
  };

  // Get the currently selected menu
  getSelectedMenuKeys = pathname => {
    return urlToList(pathname);
  };
  //动态计算菜单所占的宽度
  computedStyle(chilNode) {
    //一个字符占20*28 二级标题占20*24
    let hasChil = chilNode.filter(item => !isEmpty(item.children) && !item.hideChildrenInMenu);
    let noChil = chilNode.filter(item => isEmpty(item.children) || item.hideChildrenInMenu);
    let arr = [];
    //没子节点的和第一个有节点的组合再一起
    if (noChil.length) {
      arr.push([...noChil, ...hasChil.splice(0, 1)]);
    }

    //有节点的按两个分割一组
    arr.push(...chunk(hasChil, 2));
    let height = [];
    let width = 0;
    arr.forEach(items => {
      let h = 0;
      let w = 0;
      items.forEach(chil => {
        h += 28;
        let ownW = chil.name.length * 20;
        w = ownW > w ? ownW : w;
        if (chil.children && chil.children.length && !chil.hideChildrenInMenu) {
          h += 24;
          chil.children.forEach(c => {
            h += 28;
            let ownW = c.name.length * 20;
            w = ownW > w ? ownW : w;
          });
        }
      });
      height.push(h);
      width += w + 60;
    });
    return {
      width: width + 'px',
      height: max(height) + 30 + 'px',
    };
  }
  /**
   * 最多显示三级菜单
   */
  getSubMenuOrItem = (item, level) => {
    // doc: add hideChildrenInMenu
    const { name } = item;
    let { selectedKey } = this.state;
    let node = null;
    if (item.children && !item.hideChildrenInMenu && item.children.some(child => child.name)) {
      switch (level) {
        case 1:
          item.children.sort(chil => (chil.children ? 0 : -1));
          node = (
            <li
              key={item.path + '_1'}
              className={selectedKey.indexOf(item.path) > -1 ? styles['active'] : null}
            >
              <a>{name}</a>
              <div style={this.computedStyle(item.children)} className={styles['nav-dropdown']}>
                <div className={styles['tool-panel']}>{this.getNavMenuItems(item.children, 2)}</div>
              </div>
            </li>
          );
          break;
        case 2:
          node = (
            <div className={styles['tool-list']} key={item.path + '_2'}>
              <div className={styles['tool-title']}>{name}</div>
              <ul>{this.getNavMenuItems(item.children, 3)}</ul>
            </div>
          );
          break;
      }
      return node;
    }
    //获取路由节点
    switch (level) {
      case 1:
        node = (
          <li
            key={item.path + '_1'}
            className={selectedKey.indexOf(item.path) > -1 ? styles['active'] : null}
          >
            {this.getMenuItemPath(item)}
          </li>
        );
        break;
      case 2:
        node = (
          <dd
            key={item.path + '_2'}
            className={selectedKey.indexOf(item.path) > -1 ? styles['active'] : null}
          >
            {this.getMenuItemPath(item)}
          </dd>
        );
        break;
      default:
        node = (
          <li
            key={item.path + '_max'}
            className={selectedKey.indexOf(item.path) > -1 ? styles['active'] : null}
          >
            {this.getMenuItemPath(item)}
          </li>
        );
        break;
    }
    return node;
  };

  /**
   * 默认_blank打开新窗口
   * @memberof SiderMenu
   */
  getMenuItemPath = item => {
    const { name } = item;
    const itemPath = this.conversionPath(item.path);
    const { target } = item;
    const { location } = this.props;
    return (
      <Link to={itemPath} target={target || '_blank'} replace={itemPath === location.pathname}>
        <span>{name}</span>
      </Link>
    );
  };

  conversionPath = path => {
    if (path && path.indexOf('http') === 0) {
      return path;
    }
    return `/${path || ''}`.replace(/\/+/g, '/');
  };

  render() {
    const { theme } = this.props;
    const { menuData } = this.props;
    let cx = classNames.bind(styles);
    const cls = cx('nav-left', theme === 'light' ? 'nav-left-light' : null);
    return (
      <div className={cls}>
        <ul>{this.getNavMenuItems(menuData)}</ul>
      </div>
    );
  }
}
