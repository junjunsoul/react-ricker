import React from 'react';
import { connect } from 'dva';
import Media from 'react-media';
import PageLoading from '@/components/PageLoading';
import MobilLayout from './MobilLayout';
import PcLayout from './PcLayout';

@connect(({ user }) => ({
  isLoad: user.isLoad,
}))
class BasicLayout extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      route: { routes },
    } = this.props;

    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'global/saveAllRoute',
      payload: routes,
    });
    dispatch({
      type: 'user/fetchMenuData',
      payload: { routes },
    });
  }
  //更新设备类型
  changeMedia(isMobile) {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeMedia',
      payload: isMobile,
    });
  }

  render() {
    const { isLoad } = this.props;
    if (isLoad) {
      return <PageLoading />;
    } else {
      return (
        <Media query="(max-width: 599px)">
          {isMobile => {
            this.changeMedia(isMobile);
            return !isMobile ? <PcLayout {...this.props} /> : <MobilLayout {...this.props} />;
          }}
        </Media>
      );
    }
  }
}
export default BasicLayout;
