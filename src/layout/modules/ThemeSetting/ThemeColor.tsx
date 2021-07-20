/*
 * @Author: 焦质晔
 * @Date: 2021-07-06 12:54:20
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-07-15 21:33:10
 */
import React, { Component } from 'react';
import classNames from 'classnames';
import { CheckOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { createThemeColor } from '@/store/actions';
import { t } from '@/locale';
import { AppState } from '@/store/reducers/app';

// 自定义主题
import client from 'webpack-custom-theme/client';
import { generate } from '@ant-design/colors';

import './index.less';

export const getAntdSerials = (color) => {
  const lightens = new Array(9).fill(null).map((t, i) => {
    return client.varyColor.lighten(color, i / 10);
  });
  const darkens = new Array(6).fill(null).map((t, i) => {
    return client.varyColor.darken(color, i / 10);
  });
  const colorPalettes = generate(color);
  const rgb = client.varyColor.toNum3(color.replace('#', '')).join(',');
  return lightens.concat(darkens).concat(colorPalettes).concat(rgb);
};

const Tag = ({ color, check, ...rest }) => (
  <div
    {...rest}
    style={{
      backgroundColor: color,
    }}
  >
    {check ? <CheckOutlined /> : ''}
  </div>
);

class ThemeColor extends Component<any> {
  state = {
    colorList: [
      { color: '#F5222D' },
      { color: '#FA541C' },
      { color: '#FAAD14' },
      { color: '#13C2C2' },
      { color: '#52C41A' },
      { color: '#1890FF' },
      { color: '#2F54EB' },
      { color: '#722ED1' },
    ],
  };

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
    this.props.iframeMenus.forEach((x) => {
      const $iframe = document.getElementById(x.key) as HTMLIFrameElement;
      if (!$iframe) return;
      $iframe.contentWindow?.postMessage({ type: 'theme_color', data: color }, '*');
    });
  }

  render(): React.ReactElement {
    const { themeColor } = this.props;
    const { colorList } = this.state;
    return (
      <div className={classNames('themeColor')}>
        <h5 className={classNames('title')}>{t('app.theme.color')}</h5>
        <div>
          {colorList.map(({ color }) => (
            <Tag
              key={color.slice(1)}
              className={classNames('color-block')}
              color={color}
              check={themeColor === color}
              onClick={() => this.themeColorChangeHandle(color)}
            />
          ))}
        </div>
      </div>
    );
  }
}

export default connect(
  (state: AppState) => ({
    themeColor: state.app.themeColor,
    iframeMenus: state.app.iframeMenus,
  }),
  {
    createThemeColor,
  }
)(ThemeColor);
