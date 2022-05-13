/*
 * @Author: 焦质晔
 * @Date: 2021-11-17 14:25:10
 * @Last Modified by: 焦质晔
 * @Last Modified time: 2021-11-17 19:45:39
 */
import * as echarts from 'echarts/core';

import {
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  FunnelChart,
  GaugeChart,
} from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
} from 'echarts/components';

import { LabelLayout, UniversalTransition } from 'echarts/features';

import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  FunnelChart,
  GaugeChart,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
  CanvasRenderer,
  LabelLayout,
  UniversalTransition,
]);

export default echarts;
