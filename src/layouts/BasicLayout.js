import React from 'react';
import { connect } from 'dva';
import Media from 'react-media';
import PageLoading from '@/components/PageLoading';
import MobilLayout from './MobilLayout';
import PcLayout from './PcLayout';
import { isEmpty } from 'lodash';

@connect(({ user: { currentUser }, loading }) => ({
  currentUser,
}))
class BasicLayout extends React.PureComponent {
  componentDidMount() {
    const {
      dispatch,
      route: { routes },
    } = this.props;

    dispatch({
      type: 'user/fetchCurrent',
      payload: { routes },
    });
    dispatch({
      type: 'setting/getSetting',
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
    const { currentUser } = this.props;
    if (isEmpty(currentUser)) {
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
