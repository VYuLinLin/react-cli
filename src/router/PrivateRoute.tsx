/*
 * @Author: 焦质晔
 * @Date: 2021-07-12 10:12:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-07 13:02:50
 */
import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { matchRoutes, isIframe } from '@/router';
import { nextTick, Message } from '@/utils';
import { t } from '@/locale';
import { connect } from 'react-redux';
import { createMenuList, createTabMenu, createIframeMenu } from '@/store/actions';
import type { AppState, ITabNav } from '@/store/reducers/app';

import routes from '@/router/config';
import config from '@/config';

import Loading from '@/pages/loading';

@withRouter
class PrivateRoute extends Component<any> {
  async componentDidMount() {
    const {
      route: { path: pathname },
      flattenMenus,
    } = this.props;
    if (pathname !== '/' || isIframe(pathname) || !!flattenMenus.length) return;
    const isLoaded: boolean = await this.props.createMenuList();
    if (!isLoaded) {
      return console.error('应用菜单加载失败，请检查菜单接口！');
    }
    const tabMenus = this.getLocalTabMenus();
    tabMenus.forEach((x) => {
      if (flattenMenus.some((k) => k.key === x.path)) {
        this.props.createTabMenu({ path: x.path, title: x.title }, 'add');
      }
    });
    this.addTabMenus();
  }

  componentDidUpdate(prevProps) {
    const { pathname: prevPathname } = prevProps.location;
    const { pathname: nextPathname } = this.props.location;
    if (prevPathname !== nextPathname) {
      this.addTabMenus();
    }
  }

  getLocalTabMenus() {
    const localTabNav = localStorage.getItem('tab_menus');
    let result: ITabNav[] = [];
    if (localTabNav) {
      try {
        result = JSON.parse(localTabNav);
      } catch (err) {
        // ...
      }
    }
    return result.slice(1);
  }

  addTabMenus() {
    const { tabMenus } = this.props;
    const { pathname, search } = this.props.location;
    const { route } = matchRoutes(routes, pathname).pop();
    if (!route.meta?.title) return;
    // 最大数量判断
    if (tabMenus.length > config.maxCacheNum) {
      return Message(t('app.information.maxCache', { total: config.maxCacheNum }), 'warning');
    }
    // 选项卡菜单
    this.props.createTabMenu({ path: pathname, title: route.meta.title }, 'add');
    // iframe 模式
    if (route.iframePath) {
      this.props.createIframeMenu({ key: pathname, value: route.iframePath + search }, 'add');
    }
    // 本地存储
    nextTick(() => {
      localStorage.setItem('tab_menus', JSON.stringify(this.props.tabMenus));
    });
  }

  isMatch(arr, path) {
    return path === '/' || arr.some((x) => path.startsWith(x));
  }

  isAuth(path) {
    return this.props.flattenMenus.findIndex((x) => x.key === path) !== -1;
  }

  render(): React.ReactElement {
    const { route, whiteList, whiteAuth, flattenMenus } = this.props;
    const { path } = this.props.route;

    document.title =
      `${t('app.global.title')}-${route.meta?.title || '404'}` || t('app.global.title');

    if (!flattenMenus.length && !this.isMatch(whiteAuth, path)) {
      return <Loading />;
    }

    if (this.isMatch([...whiteList, ...whiteAuth], path) || this.isAuth(path)) {
      return this.props[`render-props`]();
    }

    return <Redirect to={'/404'} />;
  }
}

export default connect(
  (state: AppState) => ({
    tabMenus: state.app.tabMenus,
    flattenMenus: state.app.flattenMenus,
  }),
  {
    createMenuList,
    createTabMenu,
    createIframeMenu,
  }
)(PrivateRoute);
