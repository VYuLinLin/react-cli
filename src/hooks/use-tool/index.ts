/*
 * @Author: 焦质晔
 * @Date: 2022-01-17 11:22:01
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-24 19:33:08
 */
import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { OPEN_VIEW, CLOSE_VIEW, REFRESH_VIEW, PREVENT_TAB } from '@/store/types';

export default function useTool() {
  const history = useHistory();
  const location = useLocation();

  // 打开新页签
  const openView = (fullpath: string, reload?: boolean) => {
    window.parent.postMessage({ type: OPEN_VIEW, data: fullpath }, '*');
    if (reload) {
      setTimeout(() => reloadView());
    }
  };

  // 关闭页签
  const closeView = (fullpath: string) => {
    window.parent.postMessage({ type: CLOSE_VIEW, data: fullpath }, '*');
  };

  // 刷新页签
  const reloadView = () => {
    window.parent.postMessage({ type: REFRESH_VIEW, data: '' }, '*');
  };

  const addForbidenTab = (path: string, message?: string) => {
    window.parent.postMessage({ type: PREVENT_TAB, data: { action: 'add', path, message } }, '*');
  };

  const removeForbidenTab = (path: string) => {
    window.parent.postMessage({ type: PREVENT_TAB, data: { action: 'remove', path } }, '*');
  };

  return { openView, closeView, reloadView, addForbidenTab, removeForbidenTab };
}
