/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-01-15 12:45:18
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { Menu, Dropdown } from '@jiaozhiye/qm-design-react';
import { connect } from 'react-redux';
import { createLocaleLang } from '@/store/actions';
import { changeLocale } from '@/locale';
import { AppState } from '@/store/reducers/app';
import { appTool } from '@/hoc';

import './index.less';

@appTool
class LangSetting extends Component<any> {
  langChangeHandle(lang) {
    this.props.createLocaleLang(lang);
    changeLocale(lang);
    this.props.iframeMenus.forEach((x) => {
      const $iframe = document.getElementById(x.key) as HTMLIFrameElement;
      if (!$iframe) return;
      $iframe.contentWindow?.postMessage({ type: 'lang', data: lang }, '*');
    });
    // 刷新页面
    this.props.refreshView(this.props.location.pathname);
  }

  renderMenus() {
    const { lang } = this.props;
    return (
      <Menu>
        <Menu.Item
          key="zh-cn"
          disabled={lang === 'zh-cn'}
          onClick={() => this.langChangeHandle('zh-cn')}
        >
          CN&nbsp;&nbsp;简体中文
        </Menu.Item>
        <Menu.Item key="en" disabled={lang === 'en'} onClick={() => this.langChangeHandle('en')}>
          US&nbsp;&nbsp;English
        </Menu.Item>
      </Menu>
    );
  }

  render(): React.ReactElement {
    return (
      <div className={classNames('app-lang-setting')}>
        <Dropdown overlay={this.renderMenus()} placement="bottomRight" trigger={['click']}>
          <span>
            <i className={classNames('iconfont', 'icon-earth')} />
          </span>
        </Dropdown>
      </div>
    );
  }
}

export default connect(
  (state: AppState) => ({
    lang: state.app.lang,
    iframeMenus: state.app.iframeMenus,
  }),
  {
    createLocaleLang,
  }
)(LangSetting);
