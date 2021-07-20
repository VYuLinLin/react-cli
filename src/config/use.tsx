/*
 * @Author: 焦质晔
 * @Date: 2021-07-07 11:06:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-18 18:27:00
 */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { notification, message, ConfigProvider } from 'antd';
import client from 'webpack-custom-theme/client';
import '@/locale/setting';

import {
  createDictData,
  createThemeColor,
  createLocaleLang,
  createComponentSize,
} from '@/store/actions';
import { isIframe } from '@/router/index';
import { changeLocale } from '@/locale';
import { getAntdSerials } from '@/layout/modules/ThemeSetting/ThemeColor';
import { AppState } from '@/store/reducers/app'

import zhCN from 'antd/lib/locale/zh_CN';
import enGB from 'antd/lib/locale/en_GB';

import 'antd/dist/antd.less';
// import 'antd/dist/antd.dark.less'; // 引入官方提供的暗色 less 样式入口文件
// import 'antd/dist/antd.compact.less'; // 引入官方提供的紧凑 less 样式入口文件
import '@/assets/css/style.less';
import '@/assets/css/antd-ui.less';
import '@/assets/css/iconfont.less';

const messages = {
  [`zh-cn`]: zhCN,
  [`en`]: enGB,
};

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
    this.getDictData();
    const localTheme = localStorage.getItem('theme_color');
    if (localTheme && localTheme !== this.props.themeColor) {
      this.themeColorChangeHandle(localTheme);
    }
    window.addEventListener('message', this.messageEventHandle, false);
    if (isIframe(this.props.location.pathname)) {
      document.addEventListener('click', this.clickEventHandle, false);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.messageEventHandle);
    document.removeEventListener('click', this.clickEventHandle);
  }

  getDictData() {
    if (!isIframe(this.props.location.pathname)) return;
    this.props.createDictData();
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
    window.parent.postMessage({ type: 'outside_click', data: '' }, '*');
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
      <ConfigProvider locale={messages[this.props.lang]} componentSize={this.props.size}>
        {isIframe(pathname) ? (
          <section className="iframe">{this.props.children}</section>
        ) : (
          this.props.children
        )}
      </ConfigProvider>
    );
  }
}

export default connect(
  (state: AppState) => ({
    size: state.app.size,
    lang: state.app.lang,
    theme_color: state.app.themeColor,
  }),
  {
    createDictData,
    createThemeColor,
    createLocaleLang,
    createComponentSize,
  }
)(UseConfig);
