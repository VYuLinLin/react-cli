/*
 * @Author: 焦质晔
 * @Date: 2022-01-17 11:22:01
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2022-05-24 19:33:08
 */
import * as React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { OPEN_VIEW, CLOSE_VIEW, REFRESH_VIEW } from '@/store/types';

export default function useTool() {
  const history = useHistory();
  const location = useLocation();

  const openView = (fullpath: string, reload?: boolean) => {
    window.parent.postMessage({ type: OPEN_VIEW, data: fullpath }, '*');
    if (reload) {
      setTimeout(() => reloadView());
    }
  };

  const closeView = (fullpath: string) => {
    window.parent.postMessage({ type: CLOSE_VIEW, data: fullpath }, '*');
  };

  const reloadView = () => {
    window.parent.postMessage({ type: REFRESH_VIEW, data: '' }, '*');
  };

  return { openView, closeView, reloadView };
}
