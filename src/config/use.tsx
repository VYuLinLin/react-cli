/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 11:06:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-04 08:57:55
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { notification, message, QmConfigProvider } from '@jiaozhiye/qm-design-react';
import client from 'webpack-custom-theme/client';
import '@/locale/setting';

import {
  createDictData,
  createThemeColor,
  createLocaleLang,
  createComponentSize,
} from '@/store/actions';
import { isIframe } from '@/router';
import { changeLocale } from '@/locale';
import { getAntdSerials } from '@/layout/modules/ThemeSetting/ThemeColor';
import config from '@/config/envMaps';
import type { AppState } from '@/store/reducers/app';

import '@jiaozhiye/qm-design-react/lib/style/index.less';
// import 'antd/dist/antd.dark.less'; // 引入官方提供的暗色 less 样式入口文件
// import 'antd/dist/antd.compact.less'; // 引入官方提供的紧凑 less 样式入口文件
import '@/assets/css/reset.less';
import '@/assets/css/style.less';
import '@/assets/css/antd-ui.less';
import '@/assets/css/iconfont.less';

notification.config({
  duration: 4.5,
});

message.config({
  duration: 2,
  maxCount: 3,
});

@withRouter
class UseConfig extends Component<any> {
  componentDidMount() {
    const localTheme = localStorage.getItem('theme_color');
    if (localTheme && localTheme !== this.props.themeColor) {
      this.themeColorChangeHandle(localTheme);
    }
    if (isIframe(this.props.location.pathname)) {
      this.props.createDictData();
      document.addEventListener('click', this.clickEventHandle, false);
    }
    window.addEventListener('message', this.messageEventHandle, false);
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageEventHandle);
    document.removeEventListener('click', this.clickEventHandle);
  }

  themeColorChangeHandle(color) {
    const options = {
      newColors: getAntdSerials(color),
      changeUrl: (cssUrl) => `/${cssUrl}`,
      openLocalStorage: false,
    };
    client.changer.changeColor(options, Promise).then(() => {
      this.props.createThemeColor(color);
      localStorage.setItem('theme_color', color);
    });
  }

  createMouseEvent() {
    document.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }));
    document.body.click();
  }

  clickEventHandle = () => {
    window.parent.postMessage({ type: 'outside_click', data: '' }, config.domain);
  };

  messageEventHandle = ({ data }) => {
    if (typeof data !== 'object') return;
    if (data.type === 'outside_click') {
      this.createMouseEvent();
    }
    if (data.type === 'theme_color') {
      this.themeColorChangeHandle(data.data);
    }
    if (data.type === 'theme_type') {
      // ...
    }
    if (data.type === 'lang') {
      this.props.createLocaleLang(data.data);
      changeLocale(data.data);
    }
    if (data.type === 'size') {
      this.props.createComponentSize(data.data);
      localStorage.setItem('size', data.data);
    }
  };

  render(): React.ReactElement {
    const { pathname } = this.props.location;

    return (
      <QmConfigProvider locale={this.props.lang} size={this.props.size}>
        {isIframe(pathname) ? (
          <section className={classNames('app-iframe')}>{this.props.children}</section>
        ) : (
          this.props.children
        )}
      </QmConfigProvider>
    );
  }
}

export default connect(
  (state: AppState) => ({
    size: state.app.size,
    lang: state.app.lang,
    themeColor: state.app.themeColor,
  }),
  {
    createDictData,
    createThemeColor,
    createLocaleLang,
    createComponentSize,
  }
)(UseConfig);
