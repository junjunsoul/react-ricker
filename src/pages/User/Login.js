import React, { Component } from 'react';
import { connect } from 'dva';
import { formatMessage, FormattedMessage } from 'umi/locale';
import Link from 'umi/link';
import { Divider, Alert, Icon } from 'antd';
import Login from '@/components/Login';
import styles from './Login.less';
const IconFont = Icon.createFromIconfontCN({
  scriptUrl: '//at.alicdn.com/t/font_777628_nirxbiexkgq.js',
});
const { UserName, Password, Submit } = Login;

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects['login/login'],
}))
class LoginPage extends Component {
  handleSubmit = (err, values) => {
    if (!err) {
      const { dispatch } = this.props;
      dispatch({
        type: 'login/login',
        payload: {
          ...values,
        },
      });
    }
  };

  renderMessage = content => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );

  render() {
    const { login, submitting } = this.props;
    return (
      <div className={styles.main}>
        <Login
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          ref={form => {
            this.loginForm = form;
          }}
        >
          <Divider style={{ color: '#777' }}>
            <FormattedMessage id="app.login.tab-login-credentials" />
          </Divider>
          {login.status === 'error' &&
            !submitting &&
            this.renderMessage(formatMessage({ id: 'app.login.message-invalid-credentials' }))}
          <UserName
            name="userName"
            placeholder={`${formatMessage({ id: 'app.login.userName' })}: admin`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.userName.required' }),
              },
            ]}
          />
          <Password
            name="password"
            placeholder={`${formatMessage({ id: 'app.login.password' })}: 123456`}
            rules={[
              {
                required: true,
                message: formatMessage({ id: 'validation.password.required' }),
              },
            ]}
            onPressEnter={() => this.loginForm.validateFields(this.handleSubmit)}
          />
          <Submit loading={submitting}>
            <FormattedMessage id="app.login.login" />
          </Submit>
          <Divider style={{ color: '#777' }}>
            <FormattedMessage id="app.login.sign-in-with" />
          </Divider>
          <div className={styles.other}>
            <IconFont type="icon-weixin" className={styles.icon} theme="outlined" />
            <IconFont type="icon-QQ" className={styles.icon} theme="outlined" />
          </div>
        </Login>
      </div>
    );
  }
}

export default LoginPage;
