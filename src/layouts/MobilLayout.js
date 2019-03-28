import React from 'react';
import { connect } from 'dva';
import { Layout } from 'antd';
import DocumentTitle from 'react-document-title';
import isEqual from 'lodash/isEqual';
import memoizeOne from 'memoize-one';
import pathToRegexp from 'path-to-regexp';
import Authorized from '@/utils/Authorized';
import Exception403 from '../pages/Exception/403';
import Context from './MenuContext';
import Footer from './Footer';
import { LocaleProvider } from 'antd-mobile';
import { formatMessage } from 'umi/locale';
import styles from './MobilLayout.less';
import MobilMenu from '@/components/SiderMenu/MobilMenu';
import FastClick from 'fastclick';
import logo from '../assets/logo.svg';
const { Content } = Layout;

@connect(({ menu, user }) => ({
  documentTitle: global.documentTitle,
  authMenus: user.authMenus,
  authority: user.authority,
  menuData: menu.menuData,
  breadcrumbNameMap: menu.breadcrumbNameMap,
}))
class MobilLayout extends React.PureComponent {
  constructor(props) {
    super(props);
    this.getPageTitle = memoizeOne(this.getPageTitle);
    this.matchParamsPath = memoizeOne(this.matchParamsPath, isEqual);
    FastClick.attach(document.body);
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
    const { documentTitle } = this.props;
    const currRouterData = this.matchParamsPath(pathname, breadcrumbNameMap);

    if (!currRouterData) {
      return documentTitle;
    }
    const pageName = formatMessage({
      id: currRouterData.locale || currRouterData.name,
      defaultMessage: currRouterData.name,
    });

    return `${pageName}`;
  };

  render() {
    const {
      children,
      location: { pathname },
      authority,
      breadcrumbNameMap,
      route: { routes },
    } = this.props;
    const title = this.getPageTitle(pathname, breadcrumbNameMap);
    const layout = (
      <Layout
        style={{
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        <MobilMenu title={title} logo={logo} {...this.props}>
          <Content className={styles.content}>
            <Authorized
              pathname={pathname}
              routes={routes}
              authority={authority}
              children={children}
              noMatch={<Exception403 />}
            />
          </Content>
          <Footer />
        </MobilMenu>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title="Ant Design Pro">
          <Context.Provider value={this.getContext()}>
            <LocaleProvider>{layout}</LocaleProvider>
          </Context.Provider>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}
export default MobilLayout;
