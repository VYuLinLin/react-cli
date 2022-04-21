/*
 * @Author: 焦质晔
 * @Date: 2021-07-12 10:12:28
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-04-17 09:50:13
 */
import React, { Component } from 'react';
import { withRouter, Redirect } from 'react-router-dom';
import { application } from '@/hoc';
import { connect } from 'react-redux';
import { createMenuList, createTabMenu } from '@/store/actions';
import type { AppState, ITabNav } from '@/store/reducers/app';

import Loading from '@/pages/loading';

@application
@withRouter
class PrivateRoute extends Component<any> {
  get loading() {
    return !this.props.flattenMenus.length;
  }

  async componentDidMount() {
    const {
      route: { path: pathname },
    } = this.props;
    if (pathname !== '/' || !this.loading) return;
    const isLoaded: boolean = await this.props.createMenuList();
    if (!isLoaded) {
      return console.error('应用菜单加载失败，请检查菜单接口！');
    }
    this.getLocalTabMenus().forEach((x) => {
      if (this.props.flattenMenus.some((k) => k.key === x.path)) {
        this.props.createTabMenu({ path: x.path, title: x.title }, 'add');
      }
    });
    // 重要
    this.props.addTabMenus();
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

  isMatch(arr, path) {
    return path === '/' || arr.some((x) => path.startsWith(x));
  }

  isAuth(path) {
    return (
      this.props.route.meta?.noAuth ||
      this.props.flattenMenus.findIndex((x) => x.key === path) !== -1
    );
  }

  render(): React.ReactElement {
    const { whiteList, whiteAuth } = this.props;
    const { path } = this.props.route;

    if (this.isMatch([...whiteList, ...whiteAuth], path) || this.isAuth(path)) {
      return this.props[`render-props`]();
    }

    if (this.loading) {
      return <Loading />;
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
  }
)(PrivateRoute);
