/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 13:02:43
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-12 11:26:38
 */
import React, { Suspense } from 'react';
import { Router, Switch, Route, Redirect, matchPath } from 'react-router-dom';
import { getToken } from '@/utils/cookies';

import ProvideAuth from './ProvideAuth';

// 访问白名单
const whiteList: string[] = ['/login', '/public', '/wechat'];

// 权限白名单
const whiteAuth: string[] = ['/home', '/iframe', '/redirect', '/404', '/test'];

// 登录判断
export const isLogin = (): boolean => {
  if (process.env.MOCK_DATA === 'true') {
    return true;
  } else {
    return !!getToken();
  }
};

// iframe 判断
export const isIframe = (path: string): boolean => {
  return path.startsWith(whiteAuth[1]);
};

export const renderRoutes = (routes: any[] = [], extraProps = {}, switchProps = {}) => {
  return (
    <Suspense fallback={null}>
      <Switch {...switchProps}>
        {routes.map((route, index) => (
          <Route
            key={route.key || index}
            path={route.path}
            exact={route.exact}
            strict={route.strict}
            render={(props) => {
              const { path, redirect } = route;
              // 已登录
              if (isLogin()) {
                // 跳转首页
                if (path === whiteList[0]) {
                  return <Redirect to={whiteAuth[0]} />;
                }
                // 重定向
                if (redirect) {
                  return <Redirect to={redirect} />;
                }
                // 鉴权
                return (
                  <ProvideAuth
                    route={route}
                    whiteList={whiteList}
                    whiteAuth={whiteAuth}
                    render-props={() => {
                      return route.render ? (
                        route.render({ ...props, ...extraProps, route })
                      ) : (
                        <route.component {...props} {...extraProps} route={route} />
                      );
                    }}
                  />
                );
              } else {
                if (path !== whiteList[0]) {
                  return <Redirect to={whiteList[0]} />;
                }
              }
            }}
          />
        ))}
      </Switch>
    </Suspense>
  );
};

export const matchRoutes = (routes, pathname, branch: any[] = []) => {
  routes.some((route) => {
    const match = route.path
      ? matchPath(pathname, route)
      : branch.length
      ? branch[branch.length - 1].match // use parent match
      : Router.computeRootMatch(pathname); // use default "root" match
    if (match) {
      branch.push({ route, match });
      if (route.routes) {
        matchRoutes(route.routes, pathname, branch);
      }
    }
    return match;
  });
  return branch;
};
