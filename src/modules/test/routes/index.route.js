/*
 * @Author: 焦质晔
 * @Date: 2021-02-12 21:38:08
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-04 10:49:10
 */
import { lazy } from 'react';

export default {
  // webpackChunkName -> webpack 在打包编译时，生成的文件路径(名)，格式：模块名称/用例名称 service/spt1001
  routes: [
    {
      path: '/bjgl/cggl/dd',
      meta: { keepAlive: true },
      component: lazy(() => import(/* webpackChunkName: "test/demo" */ '@test/pages/demo')),
    },
    {
      path: '/bjgl/cggl/rk',
      meta: { keepAlive: true },
      component: lazy(() =>
        import(/* webpackChunkName: "test/demo" */ '@test/pages/demo/formDemo')
      ),
    },
    {
      path: '/bjgl/cggl/tk',
      meta: { keepAlive: true },
      iframePath: '/iframe/bjgl/cggl/dd',
    },
    {
      path: '/test',
      meta: { title: '测试页面', keepAlive: true },
      component: lazy(() => import(/* webpackChunkName: "test/demo" */ '@test/pages/demo')),
    },
  ],
  public: [],
};
