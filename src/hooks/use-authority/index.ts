/*
 * @Author: 焦质晔
 * @Date: 2022-01-17 10:58:59
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-03-24 13:24:57
 */
import * as React from 'react';
import store from '@/store';
import { getParentLocal } from '@/utils';

export default function useAuthority() {
  const { app } = store.getState();

  const getLocalAuth = (): Record<string, string[]> => {
    return Object.keys(app.auth).length ? app.auth : getParentLocal('auth');
  };

  /**
   * @description 对按钮进行权限控制
   * @param {string} appCode 用例号
   * @param {string} code 权限按钮的 code 码
   * @returns {boolean}
   */
  const getButtonAuth = (appCode: string, code: string): boolean => {
    const auth = getLocalAuth();
    const list: string[] = auth[appCode] ?? [];
    if (Array.isArray(list)) {
      return list.findIndex((x) => x == code) > -1;
    }
    return false;
  };

  return { getButtonAuth };
}
