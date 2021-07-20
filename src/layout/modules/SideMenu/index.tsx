/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-20 08:55:58
 */
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import classNames from 'classnames';

import { connect } from 'react-redux';

import { Menu } from 'antd';
const SubMenu = Menu.SubMenu;

import './index.less';

const getIcon = (icon = '') => {
  if (!icon) return null;
  return (
    <span className="anticon">
      <i className={classNames(`iconfont`, icon)} />
    </span>
  );
};

const conversionPath = (path = '') => {
  if (path.startsWith('http')) {
    return path;
  }
  return `/${path}`.replace(/\/+/g, '/');
};

const deepGetPath = (arr: any[], val: string, depth = ''): string[] | undefined => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].key == val) {
      return [depth + (i + 1)];
    }
    if (Array.isArray(arr[i].children)) {
      const temp = deepGetPath(arr[i].children, val, `${depth + (i + 1)}-`);
      if (temp) {
        return [depth + (i + 1), temp].flat();
      }
    }
  }
};

@withRouter
class SideMenu extends Component<any> {
  getOpenKeys(path) {
    const allOpenKeys = deepGetPath(this.props.sideMenus, path) || [];
    return allOpenKeys.slice(0, -1);
  }

  createMenuTree(arr, depth = '') {
    return arr
      .filter((x) => !x.hideInMenu)
      .map((item, index) => {
        const { title, icon, target } = item;
        const path: string = conversionPath(item.key);
        // 判断是否为 http 链接
        const httpLink = /^https?:\/\//.test(path);
        const menuItem = !httpLink ? (
          <Link to={path} target={target}>
            {getIcon(icon)}
            <span>{title}</span>
          </Link>
        ) : (
          <a href={path} target={target || '_blank'}>
            {getIcon(icon)}
            <span>{title}</span>
          </a>
        );
        const uniqueKey = depth + (index + 1);
        if (Array.isArray(item.children) && !item.hideChildrenInMenu) {
          return (
            <SubMenu
              key={uniqueKey}
              title={
                <>
                  {getIcon(icon)}
                  <span>{title}</span>
                </>
              }
            >
              {this.createMenuTree(item.children, `${uniqueKey}-`)}
            </SubMenu>
          );
        }
        return <Menu.Item key={path}>{menuItem}</Menu.Item>;
      });
  }

  render(): React.ReactElement {
    const {
      sideMenus,
      location: { pathname },
    } = this.props;
    return (
      <div className={classNames('app-side-menu')}>
        <Menu
          mode="inline"
          theme="dark"
          selectedKeys={[pathname]}
          defaultOpenKeys={this.getOpenKeys(pathname)}
        >
          {this.createMenuTree(sideMenus)}
        </Menu>
      </div>
    );
  }
}

export default connect((state: any) => ({ sideMenus: state.app.sideMenus }), {})(SideMenu);
