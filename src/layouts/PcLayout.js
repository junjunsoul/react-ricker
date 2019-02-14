import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import pathToRegexp from 'path-to-regexp';
import { formatMessage } from 'umi/locale';
import { handleChipforRoute } from '@/authorize';
import Authorized from '@/utils/Authorized';
import logo from '../assets/logo.svg';
import Footer from './Footer';
import Header from './Header';
import Context from './MenuContext';
import Exception403 from '@/pages/Exception/403';
import styles from './PcLayout.less';

const { Content } = Layout;

@connect(({ global, setting, menu, user }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  authMenus: user.authMenus,
  portArr: user.port,
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
  ...setting,
}))
class PcLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    document.querySelector('html,body,#root').style.overflow = 'auto';
    document.querySelector('body').style.overflow = 'auto';
    document.querySelector('#root').style.overflow = 'auto';
  }

  componentDidMount() {
    const { dispatch, authMenus, route, portArr } = this.props;

    //手动获取页面权限
    handleChipforRoute(route, portArr);

    //初始化菜单
    dispatch({
      type: 'menu/getMenuData',
      payload: { authMenus },
    });
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  matchParamsPath = (pathname, breadcrumbNameMap) => {
    const pathKey = Object.keys(breadcrumbNameMap).find(key => pathToRegexp(key).test(pathname));
    return breadcrumbNameMap[pathKey];
  };

  getPageTitle = (pathname, breadcrumbNameMap) => {
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return 'Ant Design Pro';
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `${pageName} - Ant Design Pro`;
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  render() {
    const {
      children,
      location: { pathname },
      isMobile,
      menuData,
      authMenus,
      breadcrumbNameMap,
      route: { routes },
      fixedHeader,
    } = this.props;
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : {};
    const layout = (
      <Layout
        style={{
          ...this.getLayoutStyle(),
          minHeight: '100vh',
        }}
      >
        <Header menuData={menuData} logo={logo} isMobile={isMobile} {...this.props} />
        <Content className={styles.content} style={contentStyle}>
          <Authorized
            pathname={pathname}
            routes={routes}
            authMenus={authMenus}
            children={children}
            noMatch={<Exception403 />}
          />
        </Content>
        <Footer />
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={this.getPageTitle(pathname, breadcrumbNameMap)}>
          <Context.Provider value={this.getContext()}>{layout}</Context.Provider>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}
export default PcLayout;
