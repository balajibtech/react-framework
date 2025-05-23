// import { MenuType } from "@/stores/Menu.store";

export interface MenuChartConfig {
  [key: string]: Record<string, ChartConfig>;
}

export interface BaseAxisConfig {
  name?: string;
  dataKey: string;
  hide?: boolean;
  textAnchor?: string;
  type:string;
  interval?: number;
  boundaryGap:boolean;
  height?: number;
  tick?: {
    fontSize?: number;
  };
}

export interface XAxisConfig extends BaseAxisConfig {
  angle?: number;
}

export interface zoomConfig {
  type: string,
  show: true,
  xAxisIndex: Array,
  start: number,
  end: number
} 
export interface legendConfig{
    showCount?: any;
    show:boolean,
    top:string,
    left:string,
    textStyle: object
}

export interface gridConfig {
    left: string,
    right: string,
    bottom: string,
    top: string,
    containLabel: boolean
}

export interface tooltipConfig{
    trigger: string,
    axisPointer: Object,
}

export interface ChartConfig {
  showTable?: boolean;
  showPerformanceData?: any;
  changeData?: any;
  col: number;
  type: 'area' | 'pie' | 'line' | 'bar' | 'state' | 'table';
  columns: Record<string, any>[];
  height: number;
  legend?: {
    hide?: boolean;
    showCount?: boolean;
    layout?: 'horizontal' | 'vertical',
    formatValue?: boolean;
  };
  grid:any
  margin?: {
    top?: number;
    right?: number;
    left?: number;
    bottom?: number;
  };
  title: string;
  xAxis: XAxisConfig;
  yAxis: BaseAxisConfig;
  tooltipData: tooltipConfig;
  brush:boolean;
  legendData: legendConfig,
  gridData: gridConfig,
  zoom: zoomConfig[];
  zoomEnableCount: number;
  chartData?: {
    dataKey: string;
    stroke?: string;
    fill?: string;
  }[];
  statistics?: {
    dataKey: string;
    dataValueKey: string;
  }[];
}

export interface StatData {
  icon?: string;
  fill?: string;
  [key: string]: any;
}

export interface StatConfig {
  statistics?: Array<{
    dataKey: string;
    dataValueKey: string;
  }>;
}

export interface ChartComponentProp {
  config: ChartConfig;
  data: anyStatData;
}

