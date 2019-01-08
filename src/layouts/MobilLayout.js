import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import pathToRegexp from 'path-to-regexp';
import Authorized from '@/utils/Authorized';
import Exception403 from '../pages/Exception/403';
import Context from './MenuContext';
import Footer from './Footer';
import { LocaleProvider } from 'antd-mobile';
import { formatMessage } from 'umi/locale';
import styles from './MobilLayout.less';

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};
@connect(({ menu, user }) => ({
  authMenus: user.authMenus,
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
}))
class MobilLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
  }
  componentDidMount() {
    const { dispatch, authMenus } = this.props;
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

  render() {
    const {
      children,
      location: { pathname },
      authMenus,
      menuData,
      breadcrumbNameMap,
      route: { routes },
    } = this.props;
    const layout = (
      <Layout
        style={{
          minHeight: '100vh',
        }}
      >
        <Content className={styles.content}>
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
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <LocaleProvider>
                  <div className={classNames(params)}>{layout}</div>
                </LocaleProvider>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}
export default MobilLayout;
