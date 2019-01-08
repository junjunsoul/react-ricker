import React from 'react';
import { connect } from 'dva';
import MobileFilter from './m.js';
import PcFilter from './p.js';

// import uaParser from '@zouxin/ua-parser'
// const isMobile = uaParser().mobile
@connect(({ global }) => ({
  global,
}))
class Test extends React.Component {
  render() {
    const {
      route: { authorized },
    } = this.props;
    console.log(authorized);
    return <div>{this.props.global.isMobile ? <MobileFilter /> : <PcFilter />}</div>;
  }
}
export default Test;
